import {Component, Inject, LOCALE_ID, Renderer2} from '@angular/core';
import {Settings} from 'luxon';
import {DOCUMENT} from '@angular/common';
import {Platform} from '@angular/cdk/platform';
import {ActivatedRoute} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {ConfigService} from '../@dg/services/config.service';
import {Style, StyleService} from '../@dg/services/style.service';
import {LayoutService} from '../@dg/services/layout.service';
import {NavigationService} from '../@dg/services/navigation.service';
import {ConfigName} from '../@dg/models/config-name.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthenticationService} from '../@dg/services/auth.service';
import {of} from "rxjs";


@Component({
    selector: 'dg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'dg';

    constructor(private configService: ConfigService,
                private styleService: StyleService,
                private renderer: Renderer2,
                private platform: Platform,
                @Inject(DOCUMENT) private document: Document,
                @Inject(LOCALE_ID) private localeId: string,
                private layoutService: LayoutService,
                private activatedRoute: ActivatedRoute,
                private route: ActivatedRoute,
                private _snackBar: MatSnackBar,
                private authService: AuthenticationService,
                private navigationService: NavigationService) {




        Settings.defaultLocale = this.localeId;

        if (this.platform.BLINK) {
            this.renderer.addClass(this.document.body, 'is-blink');
        }

        /**
         * Customize the template to your needs with the ConfigService
         * Example:
         *  this.configService.updateConfig({
         *    sidenav: {
         *      title: 'Custom App',
         *      imageUrl: '//placehold.it/100x100',
         *      showCollapsePin: false
         *    },
         *    showConfigButton: false,
         *    footer: {
         *      visible: false
         *    }
         *  });
         */

        /**
         * Config Related Subscriptions
         * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
         * Example: example.com/?layout=apollo&style=default
         */
        this.route.queryParamMap.pipe(
            map(queryParamMap => queryParamMap.has('rtl') && coerceBooleanProperty(queryParamMap.get('rtl'))),
        ).subscribe(isRtl => {
            this.document.body.dir = isRtl ? 'rtl' : 'ltr';
            this.configService.updateConfig({
                rtl: isRtl
            });
        });

        this.route.queryParamMap.pipe(
            filter(queryParamMap => queryParamMap.has('layout'))
        ).subscribe(queryParamMap => this.configService.setConfig(queryParamMap.get('layout') as ConfigName));

        this.route.queryParamMap.pipe(
            filter(queryParamMap => queryParamMap.has('style'))
        ).subscribe(queryParamMap => this.styleService.setStyle(queryParamMap.get('style') as Style));


        this.navigationService.items = [
            {
                type: 'header-link',
                label: 'Durchsuchen',
                route: '/'
            },
            {
                type: 'header-link',
                label: 'Cockpit',
                route: '/'
            },
            {
                type: 'header-link',
                label: 'Piloten',
                route: '/'
            },
            {
                type: 'link',
                label: 'Dashboard',
                route: '/'
            },
            {
                type: 'button',
                label: 'Dashboard',
                route: '/'
            },
            {
                type: 'button',
                label: 'Dashboard',
                route: '/'
            },
        ];
    }


}
