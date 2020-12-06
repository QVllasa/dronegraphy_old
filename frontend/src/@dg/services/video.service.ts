import {Injectable} from '@angular/core';

import {Video} from "../models/video.interface";
import {Videos} from "../../static-data/video-data";

@Injectable({
  providedIn: 'root'
})
export class VideoService {


  private readonly videos: Video[] = [];

  constructor() {

    this.videos = Videos();
  }


  getVideos(batch?, lastKey?) {
    return this.videos.slice(batch, lastKey);
  }

  getVideo(id) {
    return this.videos[id];
  }


}
