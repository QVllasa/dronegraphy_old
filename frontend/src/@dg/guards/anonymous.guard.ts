import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, take, tap} from 'rxjs/operators';
import {AuthenticationService} from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AnonymousGuard implements CanActivate, CanLoad {
    constructor(private authService: AuthenticationService, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.user$.pipe(
            take(1),
            map(user => !user),
            tap(isLoggedIn => {
                if (!isLoggedIn) {
                    console.log('not loggedIn');
                    console.log('access denied!');
                    this.router.navigate(['/']).then();
                }
            })
        );

    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.user$.pipe(
            take(10),
            map(user => !user),
            tap(isLoggedIn => {
                console.log('login status:', isLoggedIn);
                if (!isLoggedIn) {
                    console.log('not loggedIn');
                    console.log('access denied!');
                    this.router.navigate(['/']).then();
                }
            }));
    }
}
