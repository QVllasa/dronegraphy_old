import { Directive } from '@angular/core';

@Directive({
  selector: '[dgPageLayoutContent],dg-page-layout-content',
  host: {
    class: 'dg-page-layout-content'
  }
})
export class PageLayoutContentDirective {

  constructor() { }

}
