import {Component, Inject, Input, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'dg-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  host: {
    class: 'dg-sidebar'
  }
})
export class SidebarComponent implements OnDestroy {

  @Input() position: 'left' | 'right' = 'left';
  @Input() invisibleBackdrop: boolean;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  private _opened: boolean;

  get opened() {
    return this._opened;
  }

  @Input() set opened(opened: boolean) {
    this._opened = opened;
    opened ? this.enableScrollblock() : this.disableScrollblock();
  }

  get positionLeft() {
    return this.position === 'left';
  }

  get positionRight() {
    return this.position === 'right';
  }

  enableScrollblock() {
    if (!this.document.body.classList.contains('dg-scrollblock')) {
      this.document.body.classList.add('dg-scrollblock');
    }
  }

  disableScrollblock() {
    if (this.document.body.classList.contains('dg-scrollblock')) {
      this.document.body.classList.remove('dg-scrollblock');
    }
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  ngOnDestroy(): void {}
}
