import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Video} from '../../../@dg/models/video.model';
import {VideoResponse, VideoService} from '../../../@dg/services/video.service';
import {UserService} from '../../../@dg/services/user.service';
import {SearchService} from '../../../@dg/services/search.service';
import {ICategory} from '../../../@dg/models/category.model';
import {map, take} from 'rxjs/operators';
import {BehaviorSubject, pipe} from 'rxjs';
import {removeDuplicateObjects} from '../../../@dg/utils/remove-duplicate-objects';


@Component({
    selector: 'dg-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    videos$ = this.videoService.videos$;
    videoItem: Video = null;
    options;


    constructor(public userService: UserService,
                private activatedRoute: ActivatedRoute,
                public videoService: VideoService,
                private searchService: SearchService,
                private _snackBar: MatSnackBar
    ) {
        this.options = {
            fluid: false,
            aspectRatio: '16:9',
            autoplay: true,
            controls: false,
            loop: true,
            inactivityTimeout: 0,
            videopage: false,
            sources: [{
                src: 'https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8',
                type: 'application/x-mpegURL'
            }]
        };
    }

    ngOnInit(): void {
        this.videoService.init();
        if (!this.videoItem) {
            this.videoService.headerVideo$
                .subscribe(video => {
                    this.videoItem = video;
                });
        }
    }


    loadMore() {
        this.videoService.onLoadMore();
    }


}
