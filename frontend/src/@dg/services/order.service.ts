import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Video} from "../models/video.model";
import {map, take, takeUntil, takeWhile, tap} from "rxjs/operators";
import {StorageMap} from "@ngx-pwa/local-storage";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    cart$: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>(null)


    constructor(private storage: StorageMap) {
        // this.storage.get('cart')
        //     .pipe(
        //         takeWhile(cart => this.cart$.value !== null, true),
        //         tap((items:Video[]) => {
        //             if(items){
        //                 console.log('get:', items)
        //                 this.cart$.next(items)
        //             }
        //         })
        //     ).subscribe()

        this.cart$.subscribe(items => {
            // if (items) {
            //     console.log('add', items)
            //     this.storage.set('cart', items).subscribe()
            // }
        })
    }

    ngOnInit() {
    }
}
