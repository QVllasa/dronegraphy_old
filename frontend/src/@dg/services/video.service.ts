import {Injectable} from '@angular/core';

import {IVideo, Video} from "../models/video.model";
import {Videos} from "../../static-data/video-data";
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VideoService {


  private readonly videos: Video[] = [];

  constructor(private http: HttpClient) {

    this.videos = Videos(200);
  }


  getVideos(amount) {
    return of(Videos(amount))
  }

  getVideo(id) {
    return this.videos[id];
  }

  createVideo(data){
    console.log(data)
    return this.http.post(environment.apiUrl+'/videos', data)
  }


}
