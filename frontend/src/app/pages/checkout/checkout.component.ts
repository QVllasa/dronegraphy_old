import {Component, OnInit} from '@angular/core';
import {VideoResponse, VideoService} from '../../../@dg/services/video.service';
import {OrderService} from '../../../@dg/services/order.service';
import {UserService} from '../../../@dg/services/user.service';
import {forkJoin, Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {Video} from '../../../@dg/models/video.model';

@Component({
    selector: 'dg-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    videos = [];
    user$ = this.userService.user$.value;

    classes = '';

    // classes = 'grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5'

    constructor(private userService: UserService, private videoService: VideoService) {
    }

    ngOnInit(): void {
        if (!this.user$) {
            return;
        }
        const list: Observable<Video>[] = [];
        for (const i of this.user$.getActiveCart()) {
            list.push(this.videoService.getVideo(i).pipe(take(1)));
        }
        const videos$ = forkJoin(list);
        videos$.subscribe(res => {
            this.videos = res;
        });

    }

}
