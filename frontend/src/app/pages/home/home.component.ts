import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {User} from "../../../@dg/models/user.model";
import {of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IVideo, Video} from "../../../@dg/models/video.model";
import {VideoService} from "../../../@dg/services/video.service";
import {UserService} from "../../../@dg/services/user.service";

@Component({
  selector: 'dg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  videos: Video[] = [];
  videoItem: Video;
  initialBatch = 27;
  options: any;

  constructor(public userService: UserService,
              private activatedRoute: ActivatedRoute,
              private videoService: VideoService,
              private _snackBar: MatSnackBar
              ) { }

  ngOnInit(): void {
    this.videoService.getVideos(27, 0).subscribe(videos => {
      console.log(videos)
      this.videos = videos;

      //For Header Video
      this.videoItem = videos[0];
      this.options = {
        // poster: this.videoItem.getThumbnail(),
        fluid: false,
        aspectRatio: '16:9',
        autoplay: true,
        controls: false,
        inactivityTimeout: 0,
        videopage: false,
        sources: [{src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'application/x-mpegURL'}]
      }
    });



  }

}
