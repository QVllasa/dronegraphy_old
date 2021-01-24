import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Video} from "../../../../../../@dg/models/video.model";
import {map, mergeMap, startWith, switchMap} from "rxjs/operators";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable} from "rxjs";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";
import {NgxDropzoneChangeEvent} from "ngx-dropzone";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as uuid from 'uuid';
import {VideoService} from "../../../../../../@dg/services/video.service";
import {CategoryService} from "../../../../../../@dg/services/category.service";
import {ICategory} from "../../../../../../@dg/models/category.model";
import {HttpEventType} from "@angular/common/http";
import {UploadService} from "../../../../../../@dg/services/upload.service";


interface CountryState {
    name: string;
}


@Component({
    selector: 'dg-video-create-update',
    templateUrl: './video-create-update.component.html',
    styleUrls: ['./video-create-update.component.scss']
})
export class VideoCreateUpdateComponent implements OnInit {


    onSucess = false;
    isLoading = false;
    form: FormGroup;

    //Default create
    mode: 'create' | 'update' = 'create';

    files: File[] = [];
    thumbnail: File = null;

    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    filteredFormats: Observable<string[]>;
    filteredTags: Observable<string[]>;

    formatCtrl = new FormControl();
    tagCtrl = new FormControl();

    allFormats: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
    allTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

    categoryList: ICategory[] = [];

    @ViewChild('formatInput') formatInput: ElementRef<HTMLInputElement>;
    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('autoFormat') matAutocompleteFormat: MatAutocomplete;
    @ViewChild('autoTag') matAutocompleteTag: MatAutocomplete;


    constructor(@Inject(MAT_DIALOG_DATA) public defaults: Video,
                private _snackBar: MatSnackBar,
                private categoryService: CategoryService,
                private uploadService: UploadService,
                private videoService: VideoService,
                private dialogRef: MatDialogRef<VideoCreateUpdateComponent>,
                private fb: FormBuilder) {
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.categoryService.getCategories().subscribe(categories => {
            this.categoryList = categories
        })
        if (this.defaults) {
            this.mode = 'update';
        } else {
            this.defaults = {} as Video;
        }

        this.form = this.fb.group({
            title: [this.defaults.title || '', [Validators.required]],
            categories: [this.defaults.categories || '', [Validators.required]],
            location: [this.defaults.location || '', [Validators.required]],
            // length: [this.defaults.length || '', [Validators.pattern("^[0-9]*$"), Validators.required]],
            // fps: [this.defaults.fps || '', [Validators.pattern("^[0-9]*$"), Validators.required]],
            // height: [this.defaults.height || '', [Validators.pattern("^[0-9]*$"), Validators.required]],
            // width: [this.defaults.width || '', [Validators.pattern("^[0-9]*$"), Validators.required]],
            camera: [this.defaults.camera || '', [Validators.required]],
            formats: [this.defaults.formats || []],
            tags: [this.defaults.tags || []],
            sell: [this.defaults.getLicense || false, [Validators.required]],
            published: [this.defaults.published || false, [Validators.required]],
            thumbnail: [this.defaults.thumbnail || null]
        });

        if (this.defaults) {
            this.form.patchValue({
                thumbnail: this.defaults.thumbnail
            })
        }

        this.filteredFormats = this.formatCtrl.valueChanges.pipe(
            startWith(null),
            map((format: string | null) => format ? this._filter(format, this.allFormats) : this.allFormats.slice()));

        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => tag ? this._filter(tag, this.allTags) : this.allTags.slice()));
    }

    save() {
        if (this.mode === 'create') {
            if (!this.thumbnail) {
                this._snackBar.open("Dein Thumbnail fehlt!", "SCHLIESSEN")
                return
            }
            this.createVideo();
        } else if (this.mode === 'update') {
            if (this.form.get('thumbnail').value || this.thumbnail) {
                this.updateVideo();
            }else {
                this._snackBar.open("Thumbnail fehlt", "SCHLIESSEN")
            }
        }
    }

    createVideo() {
        const videoData = new Video().deserialize(this.form.value)
        this.isLoading = true;
        this.videoService.createVideo(videoData, this.thumbnail, this.files)
            .subscribe(res => {
                console.log(res)
                this.isLoading = false;
                this.onSucess = true;
            },
                error => {
                console.log(error)
                })

    }


    updateVideo() {
        // const videoFiles = new FormData();
        // for (let i = 0; i < this.files.length; i++) {
        //     videoFiles.append("videoFiles[]", this.files[i], this.files[i]['name']);
        // }

        console.log(this.thumbnail)
        console.log(this.defaults.thumbnail)

        this.isLoading = true;
        this.videoService.updateVideo(this.defaults.id, this.form.value, this.thumbnail)
            .subscribe(video => {
                this.defaults = new Video().deserialize(video)
                this.isLoading = false;
                this.onSucess = true;
            })
    }

    closeDialog() {
        this.dialogRef.close(this.defaults)
    }

    onSelectVideo(vid: NgxDropzoneChangeEvent) {
        this.files.push(...vid.addedFiles);
    }

    onSelectThumbnail(img: NgxDropzoneChangeEvent) {
        if (img.rejectedFiles.length > 0) {
            this._snackBar.open("Datei ist zu groß!", "SCHLIESSEN")
            return
        }
        this.thumbnail = img.addedFiles[0];
    }

    onRemoveThumbnail() {
        this.thumbnail = null;
    }


    onRemoveFile(event) {
        this.files.splice(this.files.indexOf(event), 1);
    }


    isCreateMode() {
        return this.mode === 'create';
    }

    isUpdateMode() {
        return this.mode === 'update';
    }


    add(event: MatChipInputEvent, control: string): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.update(value, control)
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.update(null)
    }

    remove(format: string, control: string): void {
        const index = this.form.get(control).value.indexOf(format);

        if (index >= 0) {
            this.form.get(control).value.splice(index, 1);
        }
    }


    private _filter(value: string, list: string[]): string[] {
        const filterValue = value.toLowerCase();
        return list.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
    }

    selected(event: MatAutocompleteSelectedEvent, control: string): void {
        this.form.get(control).value.push(event.option.viewValue)
        this.formatInput.nativeElement.value = '';
        this.formatCtrl.setValue(null);
    }


    update(value, control?: string) {
        if (!value) {
            return
        }
        let list = this.form.get(control).value;
        list.push(value.trim())
        this.form.get(control).setValue(list)
    }

    deleteThumbnail() {
        this.form.patchValue({
            thumbnail: null
        })
    }

}
