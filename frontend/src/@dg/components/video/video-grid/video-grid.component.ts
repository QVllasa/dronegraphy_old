import {ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {VideoService} from "../../../services/video.service";
import {Video} from "../../../models/video.model";


@Component({
    selector: 'dg-video-grid',
    templateUrl: './video-grid.component.html',
    styleUrls: ['./video-grid.component.scss']
})
export class VideoGridComponent implements OnInit {

    @Input() videos: Video[] = [];
    @Input() gridLayout: string;

    finished = false;

    lastIndex;

    constructor(private domSanitizer: DomSanitizer) {
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes['videos'].currentValue);
    }



    // onScrollDown() {
    //   const lastKey = this.videos.indexOf(this.videos[this.videos.length - 1]);
    //   this.loadNewVideo(lastKey + 1, lastKey + 6);
    // }


    // loadNewVideo(from, to) {
    //   const newVideos = this.videoService.getVideos(from, to);
    //   this.videos.push(...newVideos);
    // }

}
