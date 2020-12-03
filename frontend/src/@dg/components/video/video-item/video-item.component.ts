import {
    Component, ElementRef, HostListener,
    Input,
    OnInit, Renderer2, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Video} from "../../../models/video.interface";


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
    showControls: boolean;



    constructor(private domSanitizer: DomSanitizer, private router: Router, private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.poster = this.domSanitizer.bypassSecurityTrustStyle(`url(${this.videoItem.poster})`);
    }


    hyphenateUrlParams(str: string) {
        return str.replace(/\s/g, '-');
    }

    onShow() {
        this.showControls = true;
        this.timer = setTimeout(() => {
            this.loadStatus = true;
        }, 750);
    }

    onHide() {
        this.showControls = false;
        clearTimeout(this.timer);
        this.loadStatus = false;
    }

    onLoadVideo() {
        this.router.navigate(['/video', this.videoItem.id, this.hyphenateUrlParams(this.videoItem.title)]);
    }


}
