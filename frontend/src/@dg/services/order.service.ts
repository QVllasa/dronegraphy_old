import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Video} from "../models/video.interface";

@Injectable({
  providedIn: 'root'
})
export class OrderService{

  cart$: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>(null)

  constructor() {
    let storedCart = JSON.parse(localStorage.getItem("cart"))
    this.cart$.next(storedCart);
    this.cart$.subscribe(items => {
      console.log(items)
      if (items){
        storedCart.put(items)
        localStorage.setItem("cart", JSON.stringify(items))
      }
    })
  }
}
