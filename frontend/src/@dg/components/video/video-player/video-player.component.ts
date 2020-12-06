import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import videojs from 'video.js';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {ActivatedRoute, Params} from '@angular/router';
import {VideoService} from "../../../services/video.service";


// declare var require: any;
// require('videojs-contrib-quality-levels');
// require('videojs-hls-quality-selector');

@Component({
  selector: 'app-vjs-player',
  template: `
    <video #target class="video-js" [ngClass]="'bg-fit'" [style.backgroundImage]="loading" controls muted playsinline
           preload="metadata"></video>
  `,
  styleUrls: [
    './video-player.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent implements OnInit, OnDestroy {

  @ViewChild('target', {static: true}) target: ElementRef;
  // see options: https://github.com/videojs/video.js/blob/mastertutorial-options.html
  @Input() options: {
    poster: string,
    fluid: boolean,
    aspectRatio: string,
    autoplay: boolean,
    inactivityTimeout: number,
    controls: boolean,
    videopage: boolean,
    sources: {
      src: string,
      type: string,
    }[],
  };

  loading: SafeStyle = '';


  public player: videojs.Player;


  constructor(
    private elementRef: ElementRef,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {
  }

  ngOnInit() {
    // instantiate Video.js
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      this.hlsQualitySelector();
    });

    if (this.options.videopage) {
      this.route.params.subscribe((params: Params) => {
        this.player.src(this.videoService.getVideo(params.id).itemPath);
        this.player.load();
      });
    }
    this.player.on('loadstart', () => {
      this.loading = this.domSanitizer.bypassSecurityTrustStyle(`url(${this.options.poster})`);
      // this.loading = this.options.thumbnail;
    });
    this.player.on('canplay', () => {
      this.loading = '';
    });

  }


  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }
}
