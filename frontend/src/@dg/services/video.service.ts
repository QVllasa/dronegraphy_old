import {Injectable} from '@angular/core';

import {IVideo, Video} from "../models/video.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, tap} from "rxjs/operators";
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
        if (!limit){
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

    getVideosByCreator(id,limit?, page?){
        if (!page) {
            page = 0;
        }
        if (!limit){
            limit = 0;
        }
        let params = new HttpParams().set('limit', limit).set('page', page);

        return this.http.get<VideoResponse>(environment.apiUrl + '/creators/'+id,{params: params})
    }

    getVideo(id) {
        return this.videos[id];
    }

    createVideo(data) {
        console.log(data)
        return this.http.post(environment.apiUrl + '/videos', data)
    }

    mapVideos(res: VideoResponse): Video[]{
        let videoList: Video[] = []
        let loadedVideo: Video;
        for (let video of res.videos) {
            loadedVideo = new Video()
                .deserialize(video)
            loadedVideo.setCreator(new User()
                .deserialize(video.creator))
            loadedVideo.setLicense(video.sell)
            loadedVideo.setItemPath(video.hls)
            loadedVideo.setThumbnail(video.thumbnail)

            videoList.push(loadedVideo)
        }
        return videoList
    }


}
