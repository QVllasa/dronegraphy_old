import { Component, Input, OnInit } from '@angular/core';
import icHome from '@iconify/icons-ic/twotone-home';
import { trackByValue } from '../../utils/track-by';

@Component({
  selector: 'dg-breadcrumbs',
  template: `
    <div class="flex items-center">
      <dg-breadcrumb>
        <a [routerLink]="['/']">
          <ic-icon [icon]="icHome" inline="true" size="20px"></ic-icon>
        </a>
      </dg-breadcrumb>
      <ng-container *ngFor="let crumb of crumbs; trackBy: trackByValue">
        <div class="w-1 h-1 bg-gray rounded-full ltr:mr-2 rtl:ml-2"></div>
        <dg-breadcrumb>
          <a [routerLink]="[]">{{ crumb }}</a>
        </dg-breadcrumb>
      </ng-container>
    </div>
  `
})
export class BreadcrumbsComponent implements OnInit {

  @Input() crumbs: string[] = [];

  trackByValue = trackByValue;
  icHome = icHome;

  constructor() {
  }

  ngOnInit() {
  }
}
