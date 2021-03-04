import {Injectable} from '@angular/core';

import {IVideo, Video} from '../models/video.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, mergeMap, switchMap, take} from 'rxjs/operators';
import {User} from '../models/user.model';
import {BehaviorSubject, of} from 'rxjs';
import {SearchService} from './search.service';

export interface VideoResponse {
    totalcount: number;
    totalpages: number;
    page: number;
    limit: number;
    count: number;
    videos: IVideo[];
}

@Injectable({
    providedIn: 'root'
})
export class VideoService {


    videos$ = new BehaviorSubject<Video[]>([]);
    headerVideo$ = new BehaviorSubject<Video>(null);
    isLoading$ = new BehaviorSubject<boolean>(false);
    endOfResults$ = new BehaviorSubject<boolean>(false);
    response: VideoResponse;
    batchSize = 50;
    sortKey = 1;

    // TODO add filtering by category and search word
    constructor(private http: HttpClient, private searchService: SearchService) {
        this.onLoadVideos();
        this.searchService.activeSort$.subscribe(sortOption => {
            if (!sortOption) {
                return;
            }
            this.sortKey = sortOption.key;
            this.videos$.next([]);
            this.isLoading$.next(true);
            setTimeout(() => {
                    this.onReloadVideos(undefined, undefined, undefined, undefined, sortOption.key).then(() => this.isLoading$.next(false));
                },
                0
            );
        });
    }


    getVideos(limit?, page?, category?, search?, sort?) {
        if (!page) {
            page = 0;
        }
        if (!limit) {
            limit = 0;
        }
        const params = new HttpParams()
            .set('limit', limit)
            .set('page', page)
            .set('category', category)
            .set('search', search)
            .set('sort', sort)
        ;

        return this.http.get<VideoResponse>(environment.apiUrl + '/videos', {params}).pipe(take(1));
    }

    onLoadMore() {
        const limit = this.batchSize;
        const page = this.response.page + 1;
        this.endOfResults$.next(false);
        if (page === this.response.totalpages + 1) {
            this.endOfResults$.next(true);
            return;
        } else if (this.isLoading$.value) {
            return;
        }
        this.isLoading$.next(true);
        setTimeout(() => {
            this.onLoadVideos(limit, page, undefined, undefined, this.sortKey).then(() => this.isLoading$.next(false));
        }, 0);
    }

    async onLoadVideos(limit?: number, page?: number, category?: string[], search?: string[], sort?: number) {
        const res = await this.getVideos(limit, page, category, search, sort).toPromise();
        this.videos$.next([...this.videos$.value, ...this.mapVideos(res)]);
        console.log('Load', this.videos$.value.length, res);
        this.response = res;
    }

    async onReloadVideos(limit?: number, page?: number, category?: string[], search?: string[], sort?: number) {
        const res = await this.getVideos(limit, page, category, search, sort).toPromise();
        this.videos$.next([...this.videos$.value, ...this.mapVideos(res)]);
        console.log('Reload', this.videos$.value.length, res);
        this.response = res;
    }


    getVideosByCreator(id, limit?, page?) {
        if (!page) {
            page = 0;
        }
        if (!limit) {
            limit = 0;
        }
        const params = new HttpParams().set('limit', limit).set('page', page);

        return this.http.get<VideoResponse>(environment.apiUrl + '/creators/' + id, {params});
    }

    getVideo(id) {
        return this.http.get<IVideo>(environment.apiUrl + '/videos/' + id).pipe(
            map(res => {
                return this.newVideo(res);
            })
        );
    }

    removeVideo(id) {
        return this.http.delete(environment.apiUrl + '/videos/' + id);
    }

    createVideo(data: Video, thumbnail: File, videoFiles: File[]) {
        const tb = new FormData();
        tb.append('thumbnail', thumbnail, thumbnail.name);

        const files = new FormData();
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < videoFiles.length; i++) {
            files.append('videoFiles[]', videoFiles[i], videoFiles[i].name);
        }

        return this.http.post<string>(environment.apiUrl + '/videos', data)
            .pipe(
                switchMap(id => {
                    return this.uploadVideoThumbnail(id, tb);
                }),
                switchMap(id => {
                    return this.uploadVideoFiles(id, files);
                })
            );
    }

    updateVideo(id, data, thumbnail?: File) {
        const tb = new FormData();
        // tslint:disable-next-line:no-unused-expression
        thumbnail ? tb.append('thumbnail', thumbnail, thumbnail.name) : null;

        return this.http.put<IVideo>(environment.apiUrl + '/videos/' + id, data)
            .pipe(
                take(1),
                mergeMap(video => {
                    if (!thumbnail) {
                        console.log('no thumbnail change');
                        return of(this.newVideo(video));
                    }
                    return this.uploadVideoThumbnail(id, tb);
                }));
    }

    uploadVideoThumbnail(id: string, file: FormData) {
        return this.http.post<string>(environment.apiUrl + '/thumbnails/' + id, file);
    }

    uploadVideoFiles(id: string, files: FormData) {
        return this.http.post(environment.apiUrl + '/video_files/' + id, files);
    }

    mapVideos(res: VideoResponse): Video[] {
        const videoList: Video[] = [];
        if (!res.videos) {
            return videoList;
        }
        for (const video of res.videos) {
            if (video.converted) {
                videoList.push(this.newVideo(video));
            }
        }
        return videoList;
    }

    changePublishState(video: Video) {

        console.log(video.published);
        return this.http.post<IVideo>(environment.apiUrl + '/videos/' + video.id, video).pipe(
            map(res => {
                return this.newVideo(res);
            })
        );
    }

    newVideo(video: IVideo): Video {
        let loadedVideo;
        loadedVideo = new Video()
            .deserialize(video);
        loadedVideo.setCreator(new User()
            .deserialize(video.creator));
        loadedVideo.setLicense(video.sell);
        loadedVideo.setThumbnail(video.thumbnail);
        return loadedVideo;
    }


}
