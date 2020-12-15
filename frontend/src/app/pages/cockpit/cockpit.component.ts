import { Component, OnInit } from '@angular/core';
import {VideoService} from "../../../@dg/services/video.service";
import {Observable, ReplaySubject} from "rxjs";
import {Video} from "../../../@dg/models/video.model";

@Component({
  selector: 'dg-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.scss']
})
export class CockpitComponent implements OnInit {

  subject$: ReplaySubject<Video[]> = new ReplaySubject<Video[]>(1);
  data$: Observable<Video[]> = this.subject$.asObservable();
  videos: Video[];


  constructor(
      private videoService: VideoService
  ) { }

  classes = 'grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5'

  ngOnInit(): void {
    this.videoService.getVideos(27).subscribe(videos => {
      this.subject$.next(videos);
    });
  }

}
