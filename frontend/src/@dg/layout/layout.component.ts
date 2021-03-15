import {ChangeDetectorRef, Component, Inject, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {LayoutService} from '../services/layout.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MatSidenav, MatSidenavContainer} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {ConfigService} from '../services/config.service';

@UntilDestroy()
@Component({
    selector: 'dg-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    @Input() sidenavRef: TemplateRef<any>;
    @Input() toolbarRef: TemplateRef<any>;


    isLayoutVertical$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
    isDesktop$ = this.layoutService.isDesktop$;

    searchOpen$ = this.layoutService.searchOpen$;

    @ViewChild('quickpanel', {static: true}) quickpanel: MatSidenav;
    @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
    @ViewChild(MatSidenavContainer, {static: true}) sidenavContainer: MatSidenavContainer;


    constructor(private cd: ChangeDetectorRef,
                private breakpointObserver: BreakpointObserver,
                private layoutService: LayoutService,
                private configService: ConfigService,
                private router: Router,
                @Inject(DOCUMENT) private document: Document) {
    }

    ngOnInit() {

        //TODO fix sidenav with close button
        /**
         * Open/Close Sidenav through LayoutService
         */
        this.layoutService.sidenavOpen$.pipe(
            untilDestroyed(this)
        ).subscribe(open => open ? this.sidenav.open() : this.sidenav.close());

    }

    toggleCollapse(ev) {
        console.log('sidenav: ', ev);
        // this.layoutService.sidenavOpen$.value ? this.layoutService.closeSidenav() : this.layoutService.openSidenav();
    }


}
