import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {User} from "../../../@dg/models/user.model";
import {of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Video} from "../../../@dg/models/video.model";
import {VideoService} from "../../../@dg/services/video.service";

@Component({
  selector: 'dg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  videos: Video[] = [];
  initialBatch = 27;

  constructor(public authService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private videoService: VideoService,
              private _snackBar: MatSnackBar
              ) { }

  ngOnInit(): void {
    this.videos = this.videoService.getVideos(0, this.initialBatch);
  }

}
