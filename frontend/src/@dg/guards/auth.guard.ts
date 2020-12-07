import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take, tap} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";
import {AuthenticationService} from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private authService: AuthenticationService, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.user$.pipe(
            map(user => !!user),
            tap(isLoggedIn => {
                if (!isLoggedIn){
                    this.router.navigate(['/login']).then();
                }
            })
        );
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.user$.pipe(
            map(user => !!user),
            tap(isLoggedIn => {
                if (!isLoggedIn){
                    this.router.navigate(['/login']).then();
                }
            })
        );
    }

}
