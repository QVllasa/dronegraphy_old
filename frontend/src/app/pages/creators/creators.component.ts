import {Component, OnInit} from '@angular/core';
import {User} from '../../../@dg/models/user.model';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../@dg/services/user.service';
import {mergeMap, take} from 'rxjs/operators';
import {Video} from '../../../@dg/models/video.model';
import {VideoResponse, VideoService} from '../../../@dg/services/video.service';
import {forkJoin, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {hyphenateUrlParams} from '../../../@dg/utils/hyphenate-url-params';

@Component({
    selector: 'dg-creators',
    templateUrl: './creators.component.html',
    styleUrls: ['./creators.component.scss']
})
export class CreatorsComponent implements OnInit {

    creators: User[] = [];
    videos: Video[];
    isLoading: boolean;
    options: any;

    constructor(private http: HttpClient,
                private router: Router,
                private userService: UserService,
                private videoService: VideoService) {
    }

    ngOnInit(): void {

        this.isLoading = true;

        this.userService.getCreators()
            .pipe(
                mergeMap((creators: User[]) => {
                    this.creators = creators;
                    const list: Observable<VideoResponse>[] = [];
                    for (const creator of creators) {
                        list.push(this.videoService.getVideosByCreator(creator.key, -3).pipe(take(1)));
                    }
                    return forkJoin(list);
                }))
            .subscribe({
                next: values => {
                    for (const i of values) {
                        for (const j of this.creators) {
                            if (i.key === j.key) {
                                j.footage = this.videoService.mapVideos(i);
                                j.videoCount = i.totalcount;
                            }
                        }
                    }
                    this.isLoading = false;
                    console.log(this.creators);
                },
                complete: () => console.log('This is how it ends!'),
                error: err => console.log(err),
            });
    }

    onLoadCreator(creator: User) {
        this.router.navigate(['/creators', creator.key, hyphenateUrlParams(creator.getFullName())]).then();
    }

}
