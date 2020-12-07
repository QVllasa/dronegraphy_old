import {Component, OnInit, ViewChild} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {checkRouterChildsData} from "../../@dg/utils/check-router-childs-data";
import {SidebarComponent} from "../../@dg/components/sidebar/sidebar.component";
import {LayoutService} from "../../@dg/services/layout.service";
import {ConfigService} from "../../@dg/services/config.service";
import {AuthenticationService} from "../../@dg/services/auth.service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {of} from "rxjs";
import {User} from "../../@dg/models/user.model";


@UntilDestroy()
@Component({
    selector: 'dg-custom-layout',
    templateUrl: './custom-layout.component.html',
    styleUrls: ['./custom-layout.component.scss']
})
export class CustomLayoutComponent implements OnInit {

    sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;


    @ViewChild('configpanel', {static: true}) configpanel: SidebarComponent;

    constructor(private layoutService: LayoutService,
                private activatedRoute: ActivatedRoute,
                private authService: AuthenticationService,
                private configService: ConfigService,
                private _snackBar: MatSnackBar,
                private breakpointObserver: BreakpointObserver,
                private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe(
            (data:{user: User}) => {
                if (!data.user) {
                    this.authService.user$.next(null);
                }
                this.authService.user$.next(data.user)
            },
            err => {
                if (err) {
                    this.authService.user$.next(null);
                    this._snackBar.open('Unknown error', 'SCHLIESSEN', {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                    });
                }
            });

        this.layoutService.configpanelOpen$.pipe(
            untilDestroyed(this)
        ).subscribe(open => open ? this.configpanel.open() : this.configpanel.close());
    }
}
