import {ChangeDetectionStrategy, Component, HostListener, Input, OnInit, SimpleChanges} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {VideoService} from '../../../services/video.service';
import {Video} from '../../../models/video.model';


@Component({
    selector: 'dg-video-grid',
    templateUrl: './video-grid.component.html',
    styleUrls: ['./video-grid.component.scss']
})
export class VideoGridComponent implements OnInit {

    @Input() videos: Video[] = [];
    @Input() gridLayout: string;


    constructor() {
    }

    ngOnInit() {
    }





}
