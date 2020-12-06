import {Component, OnInit} from '@angular/core';
import {DateTime} from 'luxon';

@Component({
  selector: 'dg-quickpanel',
  templateUrl: './quickpanel.component.html',
  styleUrls: ['./quickpanel.component.scss']
})
export class QuickpanelComponent implements OnInit {

  date = DateTime.local().toFormat('DD');
  dayName = DateTime.local().toFormat('EEEE');

  constructor() { }

  ngOnInit() {
  }

}
