import { Component, OnInit } from '@angular/core';
import {VideoService} from "../../../@dg/services/video.service";
import {OrderService} from "../../../@dg/services/order.service";

@Component({
  selector: 'dg-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  videos = [];

  classes = ''
  // classes = 'grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5'

  constructor(
     public orderService: OrderService

  ) { }

  ngOnInit(): void {
    this.orderService.cart$.subscribe(items => {
      this.videos = items
    })
  }

}
