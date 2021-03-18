import {Component, OnInit} from '@angular/core';
import {VideoResponse, VideoService} from '../../../../@dg/services/video.service';
import {IVideo, Video} from '../../../../@dg/models/video.model';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {switchMap, tap} from 'rxjs/operators';
import {UserService} from '../../../../@dg/services/user.service';
import {Creator} from '../../../../@dg/models/user.model';

@Component({
    selector: 'dg-creator-page',
    templateUrl: './creator-page.component.html',
    styleUrls: ['./creator-page.component.scss']
})
export class CreatorPageComponent implements OnInit {

    headerVideo: Video;
    options: any;
    isLoading: boolean;

    creator: Creator;

    constructor(private videoService: VideoService, private route: ActivatedRoute, private userSerivce: UserService) {
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

        this.isLoading = true;
        this.route.params
            .pipe(
                tap(param => console.log(param['key'])),
                switchMap(param => {
                    return this.userSerivce.getCreator(+param['key']);
                }),
                switchMap(creator => {
                    this.creator = new Creator().deserialize(creator);
                    return this.videoService.getVideosByCreator(this.creator.key);
                }))
            .subscribe((res: VideoResponse) => {
                this.creator.setFootage(this.videoService.mapVideos(res));
                this.isLoading = false;
                console.log(this.creator);
            });
    }

}
