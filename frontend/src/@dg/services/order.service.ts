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
    }

    ngOnInit() {
    }
}
