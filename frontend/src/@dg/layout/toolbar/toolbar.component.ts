import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {LayoutService} from '../../services/layout.service';
import {ConfigService} from '../../services/config.service';
import {NavigationService} from '../../services/navigation.service';
import {AuthenticationService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {OrderService} from '../../services/order.service';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'dg-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input() collapsed: boolean;
    @HostBinding('class.shadow-b')

    navigationItems = this.navigationService.items;

    constructor(private layoutService: LayoutService,
                private configService: ConfigService,
                private navigationService: NavigationService,
                public orderService: OrderService,
                public router: Router,
                public userService: UserService,
                public authService: AuthenticationService) {
    }

    ngOnInit() {

    }

    toggleSidenav() {
        this.layoutService.sidenavOpen$.value ? this.layoutService.closeSidenav() : this.layoutService.openSidenav();
    }

}
