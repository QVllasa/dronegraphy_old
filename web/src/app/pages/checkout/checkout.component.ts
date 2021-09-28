import {Component, OnInit} from '@angular/core';
import {VideoResponse, VideoService} from '../../../@dg/services/video.service';
import {OrderService} from '../../../@dg/services/order.service';
import {UserService} from '../../../@dg/services/user.service';
import {forkJoin, Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {Video} from '../../../@dg/models/video.model';
import {AnimationOptions} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';

@Component({
    selector: 'dg-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    videos: Video[] = [];
    user$ = this.userService.user$;

    classes = '';
    options: AnimationOptions = {
        path: '/assets/animations/lottieflow-multimedia.json',

    };

    animationCreated(animationItem: AnimationItem): void {
        // console.log(animationItem);
    }

    // classes = 'grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5'

    constructor(private userService: UserService, private videoService: VideoService) {
    }

    ngOnInit(): void {
        if (!this.user$) {
            return;
        }
        this.user$.subscribe(user => {
            const list: Observable<Video>[] = [];
            if (user.getActiveCart() && user.getActiveCart().length !== 0) {
                for (const i of user.getActiveCart()) {
                    list.push(this.videoService.getVideo(i).pipe(take(1)));
                }
                const videos$ = forkJoin(list);
                videos$.subscribe(res => {
                    this.videos = res;
                });
            }else {
                this.videos = [];
            }
        });
    }

    updateCart(id: string) {
        this.userService.updateCart(id);
    }

}
