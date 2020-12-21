import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Video} from "../../../../../../@dg/models/video.model";
import {map, startWith} from "rxjs/operators";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable} from "rxjs";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";
import {NgxDropzoneChangeEvent} from "ngx-dropzone";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as uuid from 'uuid';
import {VideoService} from "../../../../../../@dg/services/video.service";


interface CountryState {
    name: string;
}


@Component({
    selector: 'dg-video-create-update',
    templateUrl: './video-create-update.component.html',
    styleUrls: ['./video-create-update.component.scss']
})
export class VideoCreateUpdateComponent implements OnInit {

    //
    // dummyContent = [''];
    // placeholderFile =  new File(this.dummyContent, "dummy", { type: 'video/quicktime' });


    form: FormGroup;
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

    categoryList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

    @ViewChild('formatInput') formatInput: ElementRef<HTMLInputElement>;
    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('autoFormat') matAutocompleteFormat: MatAutocomplete;
    @ViewChild('autoTag') matAutocompleteTag: MatAutocomplete;


    constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
                private _snackBar: MatSnackBar,
                private videoService: VideoService,
                private dialogRef: MatDialogRef<VideoCreateUpdateComponent>,
                private fb: FormBuilder) {


    }

    ngOnInit() {
        if (this.defaults) {
            this.mode = 'update';
        } else {
            this.defaults = {} as Video;
        }

        this.form = this.fb.group({
            title: [this.defaults.title || '', [Validators.required]],
            categories: [this.defaults.categories || '', [Validators.required]],
            location: [this.defaults.location || '', [Validators.required]],
            length: [this.defaults.length || '', [Validators.pattern("^[0-9]*$"), Validators.required]],
            fps: [this.defaults.fps || '', [Validators.pattern("^[0-9]*$"), Validators.required]],
            height: [this.defaults.height || '', [Validators.pattern("^[0-9]*$"), Validators.required]],
            width: [this.defaults.width || '', [Validators.pattern("^[0-9]*$"), Validators.required]],
            camera: [this.defaults.camera || '', [Validators.required]],
            formats: [this.defaults.formats || []],
            tags: [this.defaults.tags || []],
            sell: [this.defaults.getLicense || false, [Validators.required]],
            published: [this.defaults.published ||false, [Validators.required]]
        });


        this.filteredFormats = this.formatCtrl.valueChanges.pipe(
            startWith(null),
            map((format: string | null) => format ? this._filterFormat(format) : this.allFormats.slice()));

        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => tag ? this._filterTag(tag) : this.allFormats.slice()));
    }


    onSelectVideo(vid: NgxDropzoneChangeEvent) {
        // console.log(vid);
        this.files.push(...vid.addedFiles);
    }

    onSelectThumbnail(img: NgxDropzoneChangeEvent) {
        // console.log(img);
        if (img.rejectedFiles.length > 0) {
            this._snackBar.open("Datei ist zu groß!", "SCHLIESSEN")
            return
        }

        this.thumbnail = img.addedFiles[0];
    }

    onRemoveThumbnail() {
        this.thumbnail = null;
    }


    onRemove(event) {
        // console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }


    save() {
        // if(!this.thumbnail){
        //   this._snackBar.open("Dein Thumbnail fehlt!", "SCHLIESSEN")
        //   return
        // }
        console.log(JSON.stringify(this.form.value))
        console.log(this.thumbnail);

        // this.videoService.createVideo()

        // if (this.mode === 'create') {
        //   this.createVideo();
        // } else if (this.mode === 'update') {
        //   this.updateVideo();
        // }
    }

    createVideo() {
        console.log("onCreateVideo...")
        // const video = this.form.value;
        //
        // if (!video.imageSrc) {
        //   video.imageSrc = 'assets/img/avatars/1.jpg';
        // }
        //
        // this.dialogRef.close(video);
    }

    updateVideo() {
        console.log("onUpdateVideo...")
        // const video = this.form.value;
        // video.id = this.defaults.id;
        //
        // this.dialogRef.close(video);
    }

    isCreateMode() {
        return this.mode === 'create';
    }

    isUpdateMode() {
        return this.mode === 'update';
    }

    addFormat(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.updateFormats(value)
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.updateFormats(null)
    }

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.updateTags(value)
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.updateTags(null)
    }

    removeFormat(format: string): void {
        const index = this.form.get('formats').value.indexOf(format);

        if (index >= 0) {
            this.form.get('formats').value.splice(index, 1);
        }
    }

    removeTag(tag: string): void {
        const index = this.form.get('tags').value.indexOf(tag);

        if (index >= 0) {
            this.form.get('tags').value.splice(index, 1);
        }
    }

    private _filterTag(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
    }

    private _filterFormat(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allFormats.filter(format => format.toLowerCase().indexOf(filterValue) === 0);
    }

    selectedFormat(event: MatAutocompleteSelectedEvent): void {
        this.form.get('formats').value.push(event.option.viewValue)
        this.formatInput.nativeElement.value = '';
        this.formatCtrl.setValue(null);
    }


    selectedTag(event: MatAutocompleteSelectedEvent): void {
        this.form.get('tags').value.push(event.option.viewValue)
        this.tagInput.nativeElement.value = '';
        this.tagCtrl.setValue(null);
    }


    updateFormats(value) {
        if (!value) {
            return
        }
        let formatList = this.form.get('formats').value;
        formatList.push(value.trim())
        this.form.get('formats').setValue(formatList)
    }

    updateTags(value) {
        if (!value) {
            return
        }
        let tagList = this.form.get('tags').value;
        tagList.push(value.trim())
        this.form.get('tags').setValue(tagList)
    }

}
