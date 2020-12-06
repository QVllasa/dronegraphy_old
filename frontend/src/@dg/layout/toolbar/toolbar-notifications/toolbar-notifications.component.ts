import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ToolbarNotificationsDropdownComponent} from './toolbar-notifications-dropdown/toolbar-notifications-dropdown.component';
import icNotificationsActive from '@iconify/icons-ic/twotone-notifications-active';

@Component({
  selector: 'dg-toolbar-notifications',
  templateUrl: './toolbar-notifications.component.html',
  styleUrls: ['./toolbar-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarNotificationsComponent implements OnInit {

  @ViewChild('originRef', { static: true, read: ElementRef }) originRef: ElementRef;

  dropdownOpen: boolean;
  icNotificationsActive = icNotificationsActive;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  showPopover() {
    this.dropdownOpen = true;
    this.cd.markForCheck();

  }
}
