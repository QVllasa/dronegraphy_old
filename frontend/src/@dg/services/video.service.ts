import {Injectable} from '@angular/core';

import {Video} from "../models/video.model";
import {Videos} from "../../static-data/video-data";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VideoService {


  private readonly videos: Video[] = [];

  constructor() {

    this.videos = Videos(200);
  }


  getVideos(amount) {
    return of(Videos(amount))
  }

  getVideo(id) {
    return this.videos[id];
  }


}
