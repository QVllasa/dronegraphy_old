import {Injectable} from '@angular/core';

import {IVideo, Video} from "../models/video.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, mergeMap, take, tap} from "rxjs/operators";
import {User} from "../models/user.model";
import {of} from "rxjs";

interface VideoResponse {
    totalcount: number;
    totalpages: number;
    page: number;
    limit: number;
    count: number;
    videos: IVideo[]
}

@Injectable({
    providedIn: 'root'
})
export class VideoService {


    videos: Video[] = [];

    constructor(private http: HttpClient) {

    }


    getVideos(limit?, page?) {
        if (!page) {
            page = 0;
        }
        if (!limit) {
            limit = 0;
        }
        let params = new HttpParams().set('limit', limit).set('page', page);

        return this.http.get<VideoResponse>(environment.apiUrl + '/videos', {params: params}).pipe(
            map(res => {
                this.videos = [...this.videos, ...this.mapVideos(res)]
                return this.videos
            })
        )
        // return of(Videos(size))
    }

    getVideosByCreator(id, limit?, page?) {
        if (!page) {
            page = 0;
        }
        if (!limit) {
            limit = 0;
        }
        let params = new HttpParams().set('limit', limit).set('page', page);

        return this.http.get<VideoResponse>(environment.apiUrl + '/creators/' + id, {params: params})
    }

    getVideo(id) {
        return this.videos[id];
    }

    removeVideo(id) {
        return this.http.delete(environment.apiUrl + '/videos/' + id)
    }


    createVideo(data: Video, thumbnail: File, videoFiles: File[]) {
        const tb = new FormData()
        tb.append("thumbnail", thumbnail, thumbnail.name)

        const files = new FormData();
        for (let i = 0; i < videoFiles.length; i++) {
            files.append("videoFiles[]", videoFiles[i], videoFiles[i]['name']);
        }

        videoFiles.forEach(v => console.log(v.name))
        videoFiles.forEach(v => console.log(v.type))
        videoFiles.forEach(v => console.log(v.size))

        return this.http.post<IVideo>(environment.apiUrl + '/videos', data)
            .pipe(
                take(1),
                mergeMap(video => {
                    return this.uploadVideoThumbnail(video, tb)
                }),
                mergeMap(video => {
                    return this.uploadVideoFiles(video, files)
                }))
    }

    updateVideo(id, data, thumbnail?: File) {
        const tb = new FormData()
        thumbnail ? tb.append("thumbnail", thumbnail, thumbnail.name) : null

        return this.http.put<IVideo>(environment.apiUrl + '/videos/' + id, data)
            .pipe(
                take(1),
                mergeMap(video => {
                    if (!thumbnail) {
                        console.log("no thumbnail change")
                        return of(this.newVideo(video))
                    }
                    return this.uploadVideoThumbnail(video, tb)
                }))
    }

    uploadVideoThumbnail(video: IVideo, file: FormData) {
        return this.http.post<string>(environment.apiUrl + '/thumbnails/' + video.id, file).pipe(
            map(res => {
                console.log(res)
                const newVideo = this.newVideo(video)
                newVideo.setThumbnail(res)
                return newVideo
            })
        )
    }

    uploadVideoFiles(video: Video, files: FormData) {
        return this.http.post<File>(environment.apiUrl + '/video_files/' + video.id, files, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(res => {
                console.log(res)
                const newVideo = this.newVideo(video)
                newVideo.setThumbnail(res)
                return newVideo
            })
        )
    }

    mapVideos(res: VideoResponse): Video[] {
        let videoList: Video[] = []
        if (!res.videos) {
            return videoList
        }
        for (let video of res.videos) {
            videoList.push(this.newVideo(video))
        }
        return videoList
    }

    changePublishState(video: Video) {

        console.log(video.published)
        return this.http.post<IVideo>(environment.apiUrl + '/videos/' + video.id, video).pipe(
            map(res => {
                return this.newVideo(res)
            })
        )
    }

    newVideo(video: IVideo): Video {
        let loadedVideo;
        loadedVideo = new Video()
            .deserialize(video)
        loadedVideo.setCreator(new User()
            .deserialize(video.creator))
        loadedVideo.setLicense(video.sell)
        loadedVideo.setItemPath(video.hls)
        loadedVideo.setThumbnail(video.thumbnail)
        return loadedVideo
    }


}
