import {Component, Input, OnInit} from '@angular/core';
import {trackByRoute} from '../../utils/track-by';
import {NavigationService} from '../../services/navigation.service';
import icRadioButtonChecked from '@iconify/icons-ic/twotone-radio-button-checked';
import icRadioButtonUnchecked from '@iconify/icons-ic/twotone-radio-button-unchecked';
import {LayoutService} from '../../services/layout.service';
import {ConfigService} from '../../services/config.service';
import {map} from 'rxjs/operators';

@Component({
    selector: 'dg-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() collapsed: boolean;
  collapsedOpen$ = this.layoutService.sidenavOpen$;

    items = this.navigationService.items;
    trackByRoute = trackByRoute;

    constructor(private navigationService: NavigationService,
                private layoutService: LayoutService) {
    }

    ngOnInit() {
    }

    toggleCollapse() {
        this.collapsed ? this.layoutService.closeSidenav() : this.layoutService.openSidenav();
    }
}
