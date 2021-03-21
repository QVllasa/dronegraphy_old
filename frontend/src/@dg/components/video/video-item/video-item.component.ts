import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Video} from '../../../models/video.model';
import {hyphenateUrlParams} from '../../../utils/hyphenate-url-params';


//
// declare var require: any;
// require('videojs-contrib-quality-levels');
// require('videojs-hls-quality-selector');


@Component({
    selector: 'dg-video-item',
    templateUrl: './video-item.component.html',
    styleUrls: ['./video-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class VideoItemComponent implements OnInit {

    @Input() videoItem: Video;
    // @Input() options: any;
    @Input() playOnHover: boolean;
    @Input() mode: 'base' | 'actions' | 'details' = 'details';


    options: any;
    loadStatus: boolean;
    timer: any;
    poster: any;
    showActions: boolean;


    constructor(private domSanitizer: DomSanitizer, private router: Router) {
    }

    ngOnInit(): void {
        this.poster = this.domSanitizer.bypassSecurityTrustStyle(`url(${this.videoItem.getThumbnail()})`);
        switch (this.mode) {
            case 'actions':
                this.options = {
                    poster: this.videoItem.getThumbnail(),
                    fluid: false,
                    aspectRatio: '16:9',
                    autoplay: true,
                    controls: false,
                    inactivityTimeout: 0,
                    sources: [{src: this.videoItem.getHLS(), type: 'application/x-mpegURL'}]
                };
                break;
            case 'base':
                this.options = {
                    poster: null,
                    fluid: false,
                    aspectRatio: '16:9',
                    autoplay: true,
                    controls: true,
                    inactivityTimeout: 0,
                    sources: [{src: this.videoItem.getHLS(), type: 'application/x-mpegURL'}]
                };
                break;
            case 'details':
                this.options = {
                    poster: this.videoItem.getThumbnail(),
                    fluid: false,
                    aspectRatio: '16:9',
                    autoplay: true,
                    controls: false,
                    inactivityTimeout: 0,
                    sources: [{src: this.videoItem.getHLS(), type: 'application/x-mpegURL'}]
                };
                break;
            default:
                this.options = {
                    poster: this.videoItem.getThumbnail(),
                    fluid: false,
                    aspectRatio: '16:9',
                    autoplay: true,
                    controls: false,
                    inactivityTimeout: 0,
                    sources: [{src: this.videoItem.getHLS(), type: 'application/x-mpegURL'}]
                };
                break;
        }
    }


    onShow() {
        this.showActions = true;
        this.timer = setTimeout(() => {
            this.loadStatus = true;
        }, 750);
    }

    onHide() {
        setTimeout(() => {
            this.showActions = false;
        }, 1000);

        clearTimeout(this.timer);
        this.loadStatus = false;
    }

    // onLoadVideo(video: Video) {
    //     this.router.navigate(['footage', video.id, hyphenateUrlParams(video.title)]).then();
    // }


}
