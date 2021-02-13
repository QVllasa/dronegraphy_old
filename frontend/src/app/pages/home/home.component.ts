import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {User} from "../../../@dg/models/user.model";
import {of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IVideo, Video} from "../../../@dg/models/video.model";
import {VideoService} from "../../../@dg/services/video.service";
import {UserService} from "../../../@dg/services/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import { FilterService, IFilterOption} from "../../../@dg/services/filter.service";
import {CategoryService} from "../../../@dg/services/category.service";
import {ParentCategory} from "../../../@dg/components/tree-checkboxes/tree-checkboxes.component";



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

  filterOptions: IFilterOption[] = [];
  form: FormGroup;
  filterControl = new FormControl();
  selectedValue: string;


  constructor(public userService: UserService,
              private activatedRoute: ActivatedRoute,
              private videoService: VideoService,
              private filterService: FilterService,
              private _snackBar: MatSnackBar
              ) { }

  ngOnInit(): void {

    this.filterService.getFilters().subscribe(filters => {
      console.log(filters);
      this.filterOptions = filters
      this.filterControl.patchValue(this.filterOptions[0].value)
      this.form = new FormGroup({
        filter: this.filterControl
      });
    })



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
        sources: [{src: 'https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8', type: 'application/x-mpegURL'}]
      }
    });



  }

  filterByCategory(event: ParentCategory[]){
    const values = [];
    for (let v of event){
      values.push(v.value);
    }
    console.log(values);
  }

}
