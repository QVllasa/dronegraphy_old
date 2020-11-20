import {Component, OnInit, ViewChild} from '@angular/core';
import {filter, map, startWith} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {checkRouterChildsData} from "../../@dg/utils/check-router-childs-data";
import {SidebarComponent} from "../../@dg/components/sidebar/sidebar.component";
import {LayoutService} from "../../@dg/services/layout.service";
import {ConfigService} from "../../@dg/services/config.service";



@UntilDestroy()
@Component({
    selector: 'dg-custom-layout',
    templateUrl: './custom-layout.component.html',
    styleUrls: ['./custom-layout.component.scss']
})
export class CustomLayoutComponent implements OnInit {

    sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
    isFooterVisible$ = this.configService.config$.pipe(map(config => config.footer.visible));
    isDesktop$ = this.layoutService.isDesktop$;

    toolbarShadowEnabled$ = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null),
        map(() => checkRouterChildsData(this.router.routerState.root.snapshot, data => data.toolbarShadowEnabled))
    );

    @ViewChild('configpanel', {static: true}) configpanel: SidebarComponent;

    constructor(private layoutService: LayoutService,
                private configService: ConfigService,
                private breakpointObserver: BreakpointObserver,
                private router: Router) {
    }

    ngOnInit() {
        this.layoutService.configpanelOpen$.pipe(
            untilDestroyed(this)
        ).subscribe(open => open ? this.configpanel.open() : this.configpanel.close());
    }
}
