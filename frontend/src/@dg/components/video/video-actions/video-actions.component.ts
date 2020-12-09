import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Video} from "../../../models/video.interface";
import {fadeIn400ms} from "../../../animations/fade-in.animation";
import {OrderService} from "../../../services/order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";


// declare var require: any;
// require('videojs-contrib-quality-levels');
// require('videojs-hls-quality-selector');

@Component({
    selector: 'dg-vjs-actions',
    template: `
        <div @fadeIn class="rounded absolute top-0 right-0 left-0 h-full w-full">
            <div class="absolute top-0 right-0 p-1">
                <mat-chip-list>
                    <mat-chip *ngIf="videoItem.sell" color="primary" class="text-xxs min-h-full h-6" selected>pro
                    </mat-chip>
                    <mat-chip *ngIf="!videoItem.sell" color="accent" class="text-xxs min-h-full h-6">linzenzfrei
                    </mat-chip>
                </mat-chip-list>
            </div>
            <div class="absolute bottom-0 left-0 text-white cursor-pointer p-1">
                <mat-label class="text-sm  mat-body-strong">{{videoItem.title}}</mat-label>
                <br>
                <mat-label class=" text-sm mat-body-1 font-weight-lighter">Von {{videoItem.creator}}</mat-label>
            </div>
            <div class="absolute bottom-0 right-0 p-1 text-white">
                <button (click)="updateCart()" mat-icon-button
                        [color]="orderService.cart$.value?.includes(videoItem) ? 'warn' : 'primary'">
                    <mat-icon class="material-icons-round text-xl">{{orderService.cart$.value?.includes(videoItem) ? 'shopping_cart' : 'add_shopping_cart' }}</mat-icon>
                </button>
                <button mat-icon-button>
                    <mat-icon class="material-icons-round text-xl">favorite_border</mat-icon>
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



    constructor(
        public orderService: OrderService,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {

    }

    updateCart() {
        let videos = this.orderService.cart$.value;
        if (videos && !videos.includes(this.videoItem) ) {
            videos.push(this.videoItem)
            this._snackBar.open('Zum Warenkorb hinzugefügt.', 'SCHLIESSEN')
            console.log("added to cart")
            return
        }else if(videos && videos.includes(this.videoItem)){
            videos.splice(videos.indexOf(this.videoItem), 1)
            this._snackBar.open('Vom Warenkorb gelöscht.', 'SCHLIESSEN')
            return
        }


        videos = [];
        videos.push(this.videoItem)
        this.orderService.cart$.next(videos);
    }


    ngOnDestroy() {

    }
}
