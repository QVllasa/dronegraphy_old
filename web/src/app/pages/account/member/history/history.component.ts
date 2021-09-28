import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dg-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {


  orders: { amount: number, date: Date, method: string }[] = [
    {
      amount: 5,
      date: new Date(),
      method: 'PayPal'
    },
    {
      amount: 5,
      date: new Date(),
      method: 'PayPal'
    },
    {
      amount: 5,
      date: new Date(),
      method: 'PayPal'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
