import { Component, OnInit } from '@angular/core';
import {VideoService} from "../../../@dg/services/video.service";

@Component({
  selector: 'dg-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.scss']
})
export class CockpitComponent implements OnInit {

  videos = [];

  constructor(
      private videoService: VideoService
  ) { }

  classes = 'grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5'

  ngOnInit(): void {
    this.videos = this.videoService.getVideos(0, 27);
  }

}
