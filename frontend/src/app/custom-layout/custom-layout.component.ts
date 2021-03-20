import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {UntilDestroy} from '@ngneat/until-destroy';
import {SidebarComponent} from '../../@dg/components/sidebar/sidebar.component';
import {LayoutService} from '../../@dg/services/layout.service';
import {ConfigService} from '../../@dg/services/config.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../@dg/services/user.service';
import {User} from '../../@dg/models/user.model';


@UntilDestroy()
@Component({
    selector: 'dg-custom-layout',
    templateUrl: './custom-layout.component.html',
    styleUrls: ['./custom-layout.component.scss']
})
export class CustomLayoutComponent implements OnInit {


    @ViewChild('configpanel', {static: true}) configpanel: SidebarComponent;

    constructor(public layoutService: LayoutService,
                private activatedRoute: ActivatedRoute,
                private userService: UserService,
                private configService: ConfigService,
                private _snackBar: MatSnackBar,
                private breakpointObserver: BreakpointObserver,
                private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe(
            (data: { user: User }) => {
                if (!data.user) {
                    this.userService.user$.next(null);
                }
                this.userService.user$.next(data.user);
            },
            err => {
                if (err) {
                    this.userService.user$.next(null);
                    this._snackBar.open('Unknown error', 'SCHLIESSEN', {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                    });
                }
            });

        // this.layoutService.configpanelOpen$.pipe(
        //     untilDestroyed(this)
        // ).subscribe(open => open ? this.configpanel.open() : this.configpanel.close());
    }


}
