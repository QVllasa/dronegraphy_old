import {Component, OnInit} from '@angular/core';
import {VideoService} from '../../../../@dg/services/video.service';
import {IVideo, Video} from '../../../../@dg/models/video.model';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'dg-creator-page',
    templateUrl: './creator-page.component.html',
    styleUrls: ['./creator-page.component.scss']
})
export class CreatorPageComponent implements OnInit {

    headerVideo: Video;
    videos: Video[];
    options: any;

    constructor(private videoService: VideoService, private route: ActivatedRoute) {
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

    ngOnInit(): void {
        if (!this.headerVideo) {
            this.videoService.headerVideo$
                .subscribe(video => {
                    this.headerVideo = video;
                });
        }

        this.route.params
            .pipe(tap(param => console.log(param['key'])))
            .subscribe(param => {
            // console.log(param['key']);
        });
    }


}
