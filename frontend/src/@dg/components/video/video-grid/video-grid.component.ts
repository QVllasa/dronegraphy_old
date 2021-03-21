import {ChangeDetectionStrategy, Component, HostListener, Input, OnInit, SimpleChanges} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {VideoService} from '../../../services/video.service';
import {Video} from '../../../models/video.model';
import {hyphenateUrlParams} from '../../../utils/hyphenate-url-params';
import {Router} from '@angular/router';


@Component({
    selector: 'dg-video-grid',
    templateUrl: './video-grid.component.html',
    styleUrls: ['./video-grid.component.scss']
})
export class VideoGridComponent implements OnInit {

    @Input() videos: Video[] = [];
    @Input() gridLayout: string;


    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    onClick(ev: MouseEvent) {

        // this.router.navigate(['footage', video.id, hyphenateUrlParams(video.title)]).then();
    }


}
