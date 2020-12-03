import {Component, Inject, LOCALE_ID, OnInit, Renderer2} from '@angular/core';
import {Settings} from 'luxon';
import {DOCUMENT} from '@angular/common';
import {Platform} from '@angular/cdk/platform';
import {ActivatedRoute} from '@angular/router';
import {filter, first, map} from 'rxjs/operators';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {ConfigService} from "../@dg/services/config.service";
import {Style, StyleService} from "../@dg/services/style.service";
import {LayoutService} from "../@dg/services/layout.service";
import {NavigationService} from "../@dg/services/navigation.service";
import {ConfigName} from "../@dg/models/config-name.model";
import {AuthenticationService} from "../@dg/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../@dg/models/user.model";
import {AngularFireAuth} from "@angular/fire/auth";


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
                private route: ActivatedRoute,
                private _snackBar: MatSnackBar,
                private navigationService: NavigationService,
                private afAuth: AngularFireAuth,
                private authService: AuthenticationService) {


        this.authService.autoLogin().then(user => {
            if (!user) {
                return
            }
            this.authService.user$.next(new User(user.uid, user.email, user.firstName, user.lastName))
            return this.afAuth.idToken.pipe(first()).toPromise();
        }).then(token => {
            if (!token) {
                return
            }
            this.authService.user$.value.setToken(token)
        }).catch(err => {
            if (err) {
                console.log(err)
                this._snackBar.open('Server nicht erreichbar.', 'SCHLIESSEN', {
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                });
                indexedDB.deleteDatabase('firebaseLocalStorageDb')
            }
        })


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
