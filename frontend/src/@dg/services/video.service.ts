import {Injectable} from '@angular/core';

import {IVideo, Video} from "../models/video.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, mergeMap, switchAll, switchMap, tap} from "rxjs/operators";
import {User} from "../models/user.model";

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

    removeVideo(id){
        return this.http.delete(environment.apiUrl+'/videos/'+id)
    }

    //TODO fix upload of thumbnail
    createVideo(data: Video, thumbnail: File) {
        const tb = new FormData()
        tb.append("thumbnail", thumbnail, thumbnail.name)

        return this.http.post<IVideo>(environment.apiUrl + '/videos', data).pipe(
            mergeMap(video => {
                console.log("in mergemap")
                console.log(video)
                return this.uploadVideoThumbnail(video.id, tb).pipe(
                    map(res => {
                        console.log("in map")
                        console.log(video)
                        this.newVideo(video).setThumbnail(res)
                    }),
                )
            }),
        )
    }

    uploadVideoThumbnail(id, file: FormData){

        return this.http.post(environment.apiUrl+'/thumbnails/'+id, file, {
            reportProgress: true,
            observe: 'events'
        })
    }
    uploadVideoFiles(id, files: FormData){
        return this.http.post<File>(environment.apiUrl+'/video_files/'+id, files, {
            reportProgress: true,
            observe: 'events'
        })
    }

    mapVideos(res: VideoResponse): Video[] {
        let videoList: Video[] = []
        if (!res.videos){
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
