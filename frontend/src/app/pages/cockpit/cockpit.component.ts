import {Component, OnInit} from '@angular/core';
import {VideoService} from '../../../@dg/services/video.service';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {Video} from '../../../@dg/models/video.model';
import {UserService} from '../../../@dg/services/user.service';
import {Member} from '../../../@dg/models/user.model';

@Component({
    selector: 'dg-cockpit',
    templateUrl: './cockpit.component.html',
    styleUrls: ['./cockpit.component.scss']
})
export class CockpitComponent implements OnInit {

    videos: Video[];
    favoriteVideos: Video[] = [];
    downloadedVideos: Video[];


    constructor(
        private videoService: VideoService,
        private userService: UserService
    ) {
    }


    ngOnInit(): void {

        //TODO fix change detection
        const videos = [];
        this.downloadedVideos = [];
        this.userService.user$.subscribe(value => {
            if (value instanceof Member) {
                if (value.getFavorites()) {
                    for (const id of value.getFavorites()) {
                        this.videoService.getVideo(id).subscribe(res => {
                            videos.push(res);
                        });
                    }
                    this.favoriteVideos = videos;
                }
            }
        });

    }

}
