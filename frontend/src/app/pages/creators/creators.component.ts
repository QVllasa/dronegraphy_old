import {Component, OnInit} from '@angular/core';
import {Creator, IUser, User} from '../../../@dg/models/user.model';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../@dg/services/user.service';
import {map, mergeMap, take, tap} from 'rxjs/operators';
import {Video} from '../../../@dg/models/video.model';
import {VideoResponse, VideoService} from '../../../@dg/services/video.service';
import {forkJoin, from, Observable} from 'rxjs';

@Component({
    selector: 'dg-creators',
    templateUrl: './creators.component.html',
    styleUrls: ['./creators.component.scss']
})
export class CreatorsComponent implements OnInit {

    creators: Creator[];
    videos: Video[];
    isLoading: boolean;

    constructor(private http: HttpClient, private userService: UserService, private videoService: VideoService) {
    }

    ngOnInit(): void {
        // TODO get videos of each creator use forkJoin with list of uids
        this.isLoading = true;
        this.http.get<IUser[]>(environment.apiUrl + '/creators')
            .pipe(
                mergeMap(res => {
                    const uids = res.map(user => user.uid);
                    this.creators = [];
                    const list: Observable<VideoResponse>[] = [];
                    for (const creator of res) {
                        this.creators.push(new Creator().deserialize(creator));
                        list.push(this.videoService.getVideosByCreator(creator.uid, -5).pipe(take(1)));
                    }
                    console.log(list);
                    return forkJoin(list);
                }))
            .subscribe({
                next: values => {
                    for (const i of values) {
                        for (const j of this.creators) {
                            if (i.uid === j.uid) {
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

}
