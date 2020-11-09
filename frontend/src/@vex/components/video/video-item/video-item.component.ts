import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Video} from "../../../interfaces/video.interface";




//
// declare var require: any;
// require('videojs-contrib-quality-levels');
// require('videojs-hls-quality-selector');



@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoItemComponent implements OnInit {

  @Input() videoItem: Video;

  loadStatus: boolean;
  timer: any;
  poster: any;

  constructor(private domSanitizer: DomSanitizer, private router: Router) {
  }

  ngOnInit(): void {
    this.poster = this.domSanitizer.bypassSecurityTrustStyle(`url(${this.videoItem.poster})`);
  }


  hyphenateUrlParams(str: string) {
    return str.replace(/\s/g, '-');
  }

  onShow() {
    this.timer = setTimeout(() => {
      this.loadStatus = true;
    }, 750);
  }

  onHide() {
    clearTimeout(this.timer);
    this.loadStatus = false;
  }

  onLoadVideo() {
    this.router.navigate(['/video', this.videoItem.id, this.hyphenateUrlParams(this.videoItem.title)]);
  }


}
