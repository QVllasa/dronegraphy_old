import {Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';
import {LayoutService} from '../../services/layout.service';
import {ConfigService} from '../../services/config.service';
import {map} from 'rxjs/operators';
import {NavigationService} from '../../services/navigation.service';
import {AuthenticationService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {Video} from "../../models/video.model";

@Component({
    selector: 'dg-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    // @Input() mobileQuery: boolean;

    @Input()
    @HostBinding('class.shadow-b')
        // hasShadow: boolean;



    navigationItems = this.navigationService.items;

    isHorizontalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
    isVerticalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
    isNavbarInToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
    isNavbarBelowToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));



    constructor(private layoutService: LayoutService,
                private configService: ConfigService,
                private navigationService: NavigationService,
                public orderService: OrderService,
                public router: Router,
                public authService: AuthenticationService) {
    }

    ngOnInit() {

    }

    openQuickpanel() {
        this.layoutService.openQuickpanel();
    }

    openSidenav() {
        this.layoutService.openSidenav();
    }

    openMegaMenu(origin: ElementRef | HTMLElement) {
    }

    openSearch() {
        this.layoutService.openSearch();
    }
}
