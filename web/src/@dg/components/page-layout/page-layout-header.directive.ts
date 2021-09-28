import { Directive } from '@angular/core';

@Directive({
  selector: '[dgPageLayoutHeader],dg-page-layout-header',
  host: {
    class: 'dg-page-layout-header'
  }
})
export class PageLayoutHeaderDirective {

  constructor() { }

}

