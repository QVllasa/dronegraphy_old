import {ChangeDetectorRef, Injectable} from '@angular/core';

import {IVideo, Video} from '../models/video.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, concat, merge, of, zip} from 'rxjs';
import {SearchService} from './search.service';
import {ICategory} from '../models/category.model';
import {CategoryService} from './category.service';
import {User} from '../models/user.model';

export interface VideoResponse {
    totalcount: number;
    totalpages: number;
    page: number;
    limit: number;
    count: number;
    videos: IVideo[];
    key?: number;
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

    sortKey: number = null;
    selectedCategories: string[] = [];
    searchWords: string[];

    constructor(private http: HttpClient,
                private searchService: SearchService,
                private categoryService: CategoryService) {
    }

    init() {
        console.log('init videos');
        const activeSort$ = this.searchService.activeSort$;
        const checkedCategories$ = this.categoryService.categories$;
        const search$ = this.searchService.search$;


        return merge(
            activeSort$
                .pipe(
                    tap(sortOption => {
                        if (!sortOption) {
                            return;
                        }
                        this.sortKey = sortOption.key;
                    })
                ),
            checkedCategories$.pipe(
                tap(categories => {
                    categories = categories.filter(item => item.checked === true);
                    this.selectedCategories = categories.map(a => '' + a.key);
                })
            ),
            search$.pipe(
                tap(search => {
                    this.searchWords = search;
                })
            )
        )
            .pipe(
                switchMap(res => {
                    // console.log(res);
                    this.isLoading$.next(true);
                    this.videos$.next([]);
                    // console.log('selected categories: ', this.selectedCategories);
                    return this.onReloadVideos(
                        undefined,
                        undefined,
                        this.selectedCategories,
                        this.searchWords,
                        this.sortKey
                    );
                })
            );
    }

    getVideos(limit?: number, page?: number, category?: string[], search?: string[], sortKey?: number) {
        if (!page) {
            // Same as in Backend
            page = 1;
        }
        if (!limit) {
            // Same as in Backend
            limit = 50;
        }
        if (!category) {
            category = [];
        }
        if (!search) {
            search = [];
        }

        const transformedCategories = '[' + category + ']';

        const transformedSearch = search.join(' ');


        const params = new HttpParams()
            .set('limit', limit.toString())
            .set('page', page.toString())
            .set('search', transformedSearch)
            .set('category', transformedCategories)
            .set('sort', '' + sortKey);

        // console.log(params);

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
        this.onReloadVideos(
            limit,
            page,
            this.selectedCategories,
            this.searchWords,
            this.sortKey
        )
            .pipe(take(1))
            .subscribe(() => {
                this.isLoading$.next(false);
            });
    }

    onReloadVideos(limit?: number, page?: number, category?: string[], search?: string[], sort?: number) {
        return this.getVideos(limit, page, category, search, sort)
            .pipe(
                map(res => {
                    if (this.videos$.value.length > 0) {
                        this.videos$.next([...this.videos$.value, ...this.mapVideos(res)]);
                    } else {
                        this.videos$.next([]);
                        this.videos$.next(this.mapVideos(res));
                        this.headerVideo$.next(this.videos$.value[0]);
                    }

                    console.log('Total Reloaded Videos', this.videos$.value.length, res);
                    this.response = res;
                })
            );
    }


    getVideosByCreator(key, limit?, page?) {
        if (!page) {
            page = 0;
        }
        if (!limit) {
            limit = 0;
        }
        const params = new HttpParams().set('limit', limit).set('page', page);

        return this.http.get<VideoResponse>(environment.apiUrl + '/creators/' + key + '/videos', {params});
    }

    getVideosByOwner(uid, limit?, page?) {
        if (!page) {
            page = 0;
        }
        if (!limit) {
            limit = 0;
        }
        const params = new HttpParams().set('limit', limit).set('page', page);

        return this.http.get<VideoResponse>(environment.apiUrl + '/users/' + uid + '/videos', {params});
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

    // setProfileHeader(storageRef: string[]) {
    //     const videoHeader = {videoHeader: storageRef};
    //     return this.http.patch<string[]>(environment.apiUrl + '/header', videoHeader);
    // }
}
