import {Injectable, OnInit} from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';

import {Video} from "../models/video.interface";
import {Videos} from "../../static-data/video-data";

@Injectable({
  providedIn: 'root'
})
export class VideoService {


  private videos: Video[] = [];

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
