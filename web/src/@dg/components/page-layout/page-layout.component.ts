import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dg-page-layout',
  template: '<ng-content></ng-content>',
  host: {
    class: 'dg-page-layout'
  },
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent {

  @Input() mode: 'card' | 'simple' = 'simple';

  constructor() { }

  @HostBinding('class.dg-page-layout-card')
  get isCard() {
    return this.mode === 'card';
  }

  @HostBinding('class.dg-page-layout-simple')
  get isSimple() {
    return this.mode === 'simple';
  }

}
