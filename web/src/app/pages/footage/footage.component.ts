import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Video} from '../../../@dg/models/video.model';
import {VideoService} from '../../../@dg/services/video.service';
import {hyphenateUrlParams} from '../../../@dg/utils/hyphenate-url-params';

@Component({
    selector: 'dg-footage',
    templateUrl: './footage.component.html',
    styleUrls: ['./footage.component.scss']
})
export class FootageComponent implements OnInit {

    video: Video;
    options: any;
    isLoading: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private videoService: VideoService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        const id = this.route.snapshot.params['id'];
        // console.log(id);
        this.videoService.getVideo(id).subscribe(res => {
            this.video = res;
            this.isLoading = false;
            // console.log('options loaded');
        });
    }

    onLoadCreator(video: Video) {
        this.router.navigate(['/creators', video.getCreator().key, hyphenateUrlParams(video.getCreator().getFullName())]);
    }

}
