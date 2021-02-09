import { Component, OnInit } from '@angular/core';
import {VideoService} from "../../../@dg/services/video.service";
import {BehaviorSubject, Observable, ReplaySubject} from "rxjs";
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
  favoriteVideos: Video[] = [];
  downloadedVideos: Video[];



  constructor(
      private videoService: VideoService,
      private userService: UserService
  ) { }



  ngOnInit(): void {

    //TODO fix change detection
    let videos = [];
    this.downloadedVideos = [];
    this.userService.user$.subscribe(value => {
      if (value.getFavorites()){
        for (let id of value.getFavorites()) {
          this.videoService.getVideo(id).subscribe(res => {
            videos.push(res);
          })
        }
        this.favoriteVideos = videos;
      }
    })

  }

}
