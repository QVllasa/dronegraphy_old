import {Injectable} from '@angular/core';

import {IVideo, Video} from "../models/video.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, tap} from "rxjs/operators";
import {User} from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class VideoService {


    videos: Video[] = [];

    constructor(private http: HttpClient) {

    }


    getVideos(size, next?) {
        if (!next) {
            next = 0;
        }
        let params = new HttpParams().set('size', size).set('next', next);

        return this.http.get<IVideo[]>(environment.apiUrl + '/videos', {params: params}).pipe(
            map(videos => {
                let videoList = []
                let loadedVideo: Video;
                for (let video of videos) {
                    loadedVideo = new Video()
                        .deserialize(video)
                    loadedVideo.setCreator(new User()
                        .deserialize(video.creator))
                    loadedVideo.setLicense(video.sell)
                    loadedVideo.setItemPath(video.hls)
                    loadedVideo.setThumbnail(video.thumbnail)

                    videoList.push(loadedVideo)
                }
                this.videos = [...this.videos, ...videoList]
                return this.videos
            })
        )
        // return of(Videos(size))
    }

    getVideo(id) {
        return this.videos[id];
    }

    createVideo(data) {
        console.log(data)
        return this.http.post(environment.apiUrl + '/videos', data)
    }


}
