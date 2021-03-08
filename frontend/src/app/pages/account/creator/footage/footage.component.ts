import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, of, ReplaySubject} from "rxjs";
import {Video} from "../../../../../@dg/models/video.model";
import {TableColumn} from "../../../../../@dg/models/table-column.interface";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {FormControl} from "@angular/forms";
import {aioTableData, aioTableLabels} from "../../../../../static-data/aio-table-data";
import {filter, map} from "rxjs/operators";
import {MatSelectChange} from "@angular/material/select";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {VideoService} from "../../../../../@dg/services/video.service";
import {VideoCreateUpdateComponent} from "./video-create-update/video-create-update.component";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../../../@dg/services/user.service";
import {User} from "../../../../../@dg/models/user.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpEventType} from "@angular/common/http";
import {UploadService} from "../../../../../@dg/services/upload.service";

@Component({
    selector: 'dg-footage',
    templateUrl: './footage.component.html',
    styleUrls: ['./footage.component.scss']
})
export class FootageComponent implements OnInit {

    subject$: ReplaySubject<Video[]> = new ReplaySubject<Video[]>(0);
    data$: Observable<Video[]> = this.subject$.asObservable();
    videos: Video[];

    @Input()
    columns: TableColumn<Video>[] = [
        {label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true},
        {label: 'Thumbnail', property: 'thumbnail', type: 'image', visible: true},
        {label: 'Titel', property: 'title', type: 'text', visible: true, cssClasses: ['font-medium']},
        {label: 'Veröffentlicht', property: 'published', type: 'published', visible: true},
        // {label: 'Ort', property: 'location', type: 'text', visible: true},
        {label: 'Länge', property: 'length', type: 'length', visible: true},
        {label: 'Klicks', property: 'views', type: 'text', visible: true},
        {label: 'Downloads', property: 'downloads', type: 'text', visible: true},
        {label: 'Erstellt', property: 'createdAt', type: 'date', visible: true},
        // { label: 'Camera', property: 'address', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
        // { label: 'tags', property: 'street', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
        // { label: 'Zipcode', property: 'zipcode', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
        // { label: 'City', property: 'city', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
        // { label: 'Phone', property: 'phoneNumber', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
        // { label: 'Labels', property: 'labels', type: 'button', visible: true },
        {label: '', property: 'actions', type: 'button', visible: true}
    ];
    pageSize = 5;
    pageSizeOptions: number[] = [5, 10, 20, 50];
    totalCount: number;
    dataSource: MatTableDataSource<Video> | null;
    selection = new SelectionModel<Video>(true, []);
    searchCtrl = new FormControl();

    labels = aioTableLabels;


    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;


    constructor(private videoService: VideoService,
                private userSevice: UserService,
                private _snackBar: MatSnackBar,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.getData().subscribe(videos => {
            this.subject$.next(videos);
        });

        this.dataSource = new MatTableDataSource();

        this.data$.pipe(
            filter<Video[]>(Boolean)
        ).subscribe(videos => {
            this.videos = videos;
            this.dataSource.data = videos;
        });



        this.searchCtrl.valueChanges.subscribe(value => this.onFilterChange(value));
    }


    get visibleColumns() {
        return this.columns.filter(column => column.visible).map(column => column.property);
    }

    /**
     * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
     * We are simulating this request here.
     */
    getData() {
        return this.videoService.getVideosByCreator(this.userSevice.user$.value.uid, -1, 0).pipe(
            map(res => {
                this.totalCount = res.totalcount
                if (!res.videos) {
                    return []
                }
                return this.videoService.mapVideos(res)
            })
        )
    }


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    createVideo() {
        this.dialog.open(VideoCreateUpdateComponent, {
        });
    }

    updateVideo(video: Video) {
        this.dialog.open(VideoCreateUpdateComponent, {
            data: video
        }).afterClosed().subscribe(updatedVideo => {
            if (updatedVideo) {
                const index = this.videos.findIndex((existingVideo) => existingVideo.id === updatedVideo.id);
                this.videos[index] = updatedVideo;
                this.subject$.next(this.videos);
            }
        });
    }

    deleteVideo(video: Video, multiple: boolean) {
        this.videoService.removeVideo(video.id).subscribe(res => {
            this.videos.splice(this.videos.findIndex((existingVideo) => existingVideo.id === video.id), 1);
            this.subject$.next(this.videos);
            if (!multiple) {
                this._snackBar.open("Aufnahme gelöscht", "SCHLIESSEN")
            }
        })

    }

    deleteVideos(videos: Video[]) {
        videos.forEach(c => this.deleteVideo(c, true));
        this.selection.clear()
        this._snackBar.open("Aufnahme gelöscht", "SCHLIESSEN")
    }

    onFilterChange(value: string) {
        if (!this.dataSource) {
            return;
        }
        value = value.trim();
        value = value.toLowerCase();
        this.dataSource.filter = value;
    }

    toggleColumnVisibility(column, event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        column.visible = !column.visible;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    trackByProperty<T>(index: number, column: TableColumn<T>) {
        return column.property;
    }

    onLabelChange(change: MatSelectChange, row: Video) {
        const index = this.videos.findIndex(c => c === row);
        // this.videos[index].labels = change.value;
        this.subject$.next(this.videos);
    }


    updatePublishState(video: Video) {
        video.published = !video.published

        this.videoService.changePublishState(video).subscribe(res => {
            this.videos[this.videos.findIndex(el => el.id === res.id)] = res;
            this._snackBar.open("Status geändert!", "SCHLIESSEN")
        })

    }


}
