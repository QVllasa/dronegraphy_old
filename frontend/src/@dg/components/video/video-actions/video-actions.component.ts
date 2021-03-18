import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Video} from '../../../models/video.model';
import {fadeIn400ms} from '../../../animations/fade-in.animation';
import {OrderService} from '../../../services/order.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {FavoritesService} from '../../../services/favorites.service';
import {hyphenateUrlParams} from '../../../utils/hyphenate-url-params';
import {Creator} from '../../../models/user.model';


// declare var require: any;
// require('videojs-contrib-quality-levels');
// require('videojs-hls-quality-selector');

@Component({
    selector: 'dg-vjs-actions',
    template: `
        <div @fadeIn class="rounded absolute top-0 right-0 left-0 h-full w-full">
            <div class="absolute top-0 right-0 p-1">
                <mat-chip-list>
                    <mat-chip *ngIf="videoItem.getLicense()" color="primary" class="text-xxs min-h-full h-6" selected>
                        pro
                    </mat-chip>
                    <mat-chip *ngIf="!videoItem.getLicense()" color="accent" class="text-xxs min-h-full h-6">linzenzfrei
                    </mat-chip>
                </mat-chip-list>
            </div>
            <div class="absolute bottom-0 left-0 text-white cursor-pointer p-1">
                <mat-label class="text-sm  mat-body-strong">{{videoItem.title}}</mat-label>
                <br>
                <mat-label class=" text-sm mat-body-1 font-weight-lighter">
                    Von {{videoItem.getCreator().getFullName()}}</mat-label>
            </div>
            <div class="absolute bottom-0 right-0 p-1 text-white">
                <ng-container *ngIf="!userService.user$.value || userService.user$.value.role.includes('ROLE_MEMBER')">
                    <button (click)="updateCart()" mat-icon-button
                            [color]="orderService.cart$.value?.includes(videoItem) ? 'warn' : null">
                        <mat-icon
                                class="material-icons-round text-xl">{{orderService.cart$.value?.includes(videoItem) ? 'shopping_cart' : 'add_shopping_cart' }}</mat-icon>
                    </button>
                    <!--                    <button mat-icon-button (click)="updateFavorites(videoItem.id)"-->
                    <!--                            [color]="!(userService.user$.value instanceof Creator) && userService.user$.value?.getFavorites()?.includes(videoItem.id) ? 'warn' : null">-->
                    <!--                        <mat-icon-->
                    <!--                                class="material-icons-round text-xl">{{userService.user$.value?.getFavorites()?.includes(videoItem.id) ? 'favorite' : 'favorite_border'}}</mat-icon>-->
                    <!--                    </button>-->
                </ng-container>
                <button mat-icon-button>
                    <mat-icon class="material-icons-round text-xl">share</mat-icon>
                </button>
            </div>
        </div>
    `,
    styleUrls: [
        './video-actions.component.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fadeIn400ms
    ]
})
export class VideoActionsComponent implements OnInit, OnDestroy {

    @Input() videoItem: Video;


    constructor(
        public orderService: OrderService,
        public favoritesService: FavoritesService,
        public router: Router,
        public userService: UserService,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {

    }

    // Adds and deletes items from cart
    updateCart() {
        if (!this.userService.user$.value) {
            this.router.navigate(['/login']).then();
            return;
        }
        let videos = this.orderService.cart$.value;
        if (videos && !videos.includes(this.videoItem)) {
            videos.push(this.videoItem);
            this._snackBar.open('Zum Warenkorb hinzugefügt.', 'SCHLIESSEN');
            return;
        } else if (videos && videos.includes(this.videoItem)) {
            videos.splice(videos.indexOf(this.videoItem), 1);
            this._snackBar.open('Vom Warenkorb gelöscht.', 'SCHLIESSEN');
            return;
        }


        videos = [];
        videos.push(this.videoItem);
        this.orderService.cart$.next(videos);
    }

    // updateFavorites(id: string) {
    //     if (!this.userService.user$.value) {
    //         this.router.navigate(['/login']).then();
    //         return;
    //     }
    //     //Remove from favorites
    //     if (this.userService.user$.value.favoriteVideos.includes(id)) {
    //         this.favoritesService.deleteFromFavorites(id).subscribe(res => {
    //             this.userService.user$.value.setFavorites(res);
    //             this._snackBar.open('Aus Favoriten entfernt.', 'SCHLIESSEN');
    //         });
    //         //Add to favorites
    //     } else {
    //         this.favoritesService.saveAsFavorite(id).subscribe(res => {
    //             this.userService.user$.value.setFavorites(res);
    //             this._snackBar.open('Zu Favoriten hinzugefügt.', 'SCHLIESSEN');
    //         });
    //     }
    // }


    ngOnDestroy() {

    }
}
