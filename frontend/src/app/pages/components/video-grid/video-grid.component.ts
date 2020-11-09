import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {VideoService} from "../../../../@vex/services/video.service";
import {Video} from "../../../../@vex/interfaces/video.interface";




@Component({
  selector: 'vex-video-grid',
  templateUrl: './video-grid.component.html',
  styleUrls: ['./video-grid.component.scss']
})
export class VideoGridComponent implements OnInit {

  videos: Video[] = [];

  finished = false;
  initialBatch = 27;
  lastIndex;

  constructor(private domSanitizer: DomSanitizer,
              private videoService: VideoService) { }

  ngOnInit() {
    this.videos = this.videoService.getVideos(0, this.initialBatch);
    console.log(this.videos);
  }

  // onScrollDown() {
  //   const lastKey = this.videos.indexOf(this.videos[this.videos.length - 1]);
  //   this.loadNewVideo(lastKey + 1, lastKey + 6);
  // }


  // loadNewVideo(from, to) {
  //   const newVideos = this.videoService.getVideos(from, to);
  //   this.videos.push(...newVideos);
  // }

}
