import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Video} from '../../../models/video.model';
import {fadeIn400ms} from '../../../animations/fade-in.animation';
import {OrderService} from '../../../services/order.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {FavoritesService} from '../../../services/favorites.service';
import {User} from '../../../models/user.model';


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
                <button (click)="updateCart(videoItem.id)" mat-icon-button
                        [color]="inCart(videoItem.id) ? 'warn' : null">
                    <mat-icon
                            class="material-icons-round text-xl">{{inCart(videoItem.id) ? 'shopping_cart' : 'add_shopping_cart' }}</mat-icon>
                </button>
                <button mat-icon-button (click)="toggleFavorite(videoItem.id)"
                        [color]="isFavorite(videoItem.id) ? 'warn' : null">
                    <mat-icon
                            class="material-icons-round text-xl">{{isFavorite(videoItem.id) ? 'favorite' : 'favorite_border'}}</mat-icon>
                </button>
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
    user$: User = this.userService.user$.value;


    constructor(
        public orderService: OrderService,
        public favoritesService: FavoritesService,
        public router: Router,
        public userService: UserService,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
        // this.userService.user$.subscribe(user => {
        //     // console.log(user);
        //     this.user = user;
        // });
    }

    isFavorite(id): boolean {
        if (!this.user$) {
            return false;
        }
        return this.user$.getFavorites().includes(id);
    }

    inCart(id) {
        if (!this.user$) {
            return false;
        }
        return this.user$.getActiveCart().includes(id);
    }

    // Adds and deletes items from cart
    updateCart(id: string) {
        if (!this.user$) {
            this.router.navigate(['/login']).then();
            return;
        }
        if (this.user$.getActiveCart().includes(id)) {
            this.user$.activeCart.splice(this.user$.activeCart.indexOf(id, 0), 1);
            this.orderService.updateCart(this.user$.activeCart).subscribe(res => {
                this.user$.activeCart = res;
                this.userService.user$.next(this.user$);
                this._snackBar.open('Zum Warenkorb hinzugefügt.', 'SCHLIESSEN', {duration: 1000});
            });
            // Add to favorites
        } else {
            this.user$.addToCart(id);
            this.orderService.updateCart(this.user$.getActiveCart()).subscribe(res => {
                this.user$.activeCart = res;
                this.userService.user$.next(this.user$);
                this._snackBar.open('Aus Warenkorb entfernt.', 'SCHLIESSEN', {duration: 1000});
            });
        }
    }

    toggleFavorite(id: string) {
        if (!this.user$) {
            this.router.navigate(['/login']).then();
            return;
        }

        console.log(id);

        // Remove from favorites
        if (this.user$.getFavorites().includes(id)) {
            this.user$.favoriteVideos.splice(this.user$.favoriteVideos.indexOf(id, 0), 1);
            this.favoritesService.updateFavorite(this.user$.favoriteVideos).subscribe(res => {
                this.user$.favoriteVideos = res;
                this.userService.user$.next(this.user$);
                this._snackBar.open('Aus Favoriten entfernt.', 'SCHLIESSEN', {duration: 1000});
            });
            // Add to favorites
        } else {
            this.user$.addToFavorite(id);
            this.favoritesService.updateFavorite(this.user$.getFavorites()).subscribe(res => {
                this.user$.favoriteVideos = res;
                this.userService.user$.next(this.user$);
                this._snackBar.open('Zu Favoriten hinzugefügt.', 'SCHLIESSEN', {duration: 1000});
            });
        }
    }


    ngOnDestroy() {

    }
}
