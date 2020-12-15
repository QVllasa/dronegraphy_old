import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Video} from "../../../models/video.model";


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
    showActions: boolean;
    options: any;




    constructor(private domSanitizer: DomSanitizer, private router: Router) {
    }

    ngOnInit(): void {
        this.poster = this.domSanitizer.bypassSecurityTrustStyle(`url(${this.videoItem.getThumbnail()})`);
        this.options = {
            poster: this.videoItem.getThumbnail(),
            fluid: false,
            aspectRatio: '16:9',
            autoplay: true,
            controls: false,
            inactivityTimeout: 0,
            videopage: false,
            sources: [{src: this.videoItem.getItemPath(), type: 'application/x-mpegURL'}]
        }

    }


    hyphenateUrlParams(str: string) {
        return str.replace(/\s/g, '-');
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

    onLoadVideo() {
        this.router.navigate(['/video', this.videoItem.id, this.hyphenateUrlParams(this.videoItem.title)]).then();
    }


}
