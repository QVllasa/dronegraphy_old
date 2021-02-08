import { Component, OnInit } from '@angular/core';
import {VideoService} from "../../../@dg/services/video.service";
import {Observable, ReplaySubject} from "rxjs";
import {Video} from "../../../@dg/models/video.model";
import {UserService} from "../../../@dg/services/user.service";

@Component({
  selector: 'dg-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.scss']
})
export class CockpitComponent implements OnInit {

  // subject$: ReplaySubject<Video[]> = new ReplaySubject<Video[]>(1);
  // data$: Observable<Video[]> = this.subject$.asObservable();
  videos: Video[];
  favoriteVideos: Video[];
  downloadedVideos: Video[];



  constructor(
      private videoService: VideoService,
      private userService: UserService
  ) { }

  classes = 'grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5'

  ngOnInit(): void {
    // this.videoService.getVideos(27).subscribe(videos => {
    //   this.subject$.next(videos);
    // });
    this.favoriteVideos = [];
    this.downloadedVideos = [];
    for (let id of this.userService.user$.value.favoriteVideos) {
      //TODO use HTTP-Req
      this.videoService.getVideo(id).subscribe(res => {
        this.favoriteVideos.push(res)
      })
    }

  }

}
