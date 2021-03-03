import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Video} from '../../../@dg/models/video.model';
import {VideoResponse, VideoService} from '../../../@dg/services/video.service';
import {UserService} from '../../../@dg/services/user.service';
import {SearchService} from '../../../@dg/services/search.service';
import {ICategory} from '../../../@dg/models/category.model';
import {map, take} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {removeDuplicateObjects} from '../../../@dg/utils/remove-duplicate-objects';


@Component({
    selector: 'dg-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    videos$ = new BehaviorSubject<Video[]>([]);
    response: VideoResponse;
    videoItem: Video = null;
    options: any;
    batchSize = 50;
    endOfResults: boolean;
    isLoading: boolean;


    constructor(public userService: UserService,
                private activatedRoute: ActivatedRoute,
                private videoService: VideoService,
                private searchService: SearchService,
                private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit(): void {
        this.loadVideos();
        // TODO
        // this.searchService.activeSort$.subscribe()
    }

    onLoad() {
        const limit = this.batchSize;
        const page = this.response.page + 1;
        this.endOfResults = false;
        if (page === this.response.totalpages + 1) {
            this.endOfResults = true;
            return;
        }
        this.isLoading = true;
        this.loadVideos(limit, page);
    }

    async loadVideos(limit?: number, page?: number, category?: string[], search?: string[], sort?: number) {
        const res = await this.videoService.getVideos(limit, page, category, search, sort).toPromise();
        this.videos$.next([...this.videos$.value, ...this.videoService.mapVideos(res)]);
        console.log(this.videos$.value.length);
        // For Header Video
        if (!this.videoItem) {
            this.videoItem = this.videos$.value[0];
            this.options = {
                fluid: false,
                aspectRatio: '16:9',
                autoplay: true,
                controls: false,
                inactivityTimeout: 0,
                videopage: false,
                sources: [{
                    src: 'https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8',
                    type: 'application/x-mpegURL'
                }]
            };
        }
        this.response = res;
        this.isLoading = false;
    }


}
