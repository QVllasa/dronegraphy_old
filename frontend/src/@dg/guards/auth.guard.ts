import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from "rxjs/operators";
import {UserService} from "../services/user.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private userService: UserService, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.userService.user$.pipe(
            map(user => !!user),
            tap(isLoggedIn => {
                if (!isLoggedIn){
                    this.router.navigate(['/login']).then();
                }
            })
        );
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.userService.user$.pipe(
            map(user => !!user),
            tap(isLoggedIn => {
                if (!isLoggedIn){
                    this.router.navigate(['/login']).then();
                }
            })
        );
    }

}
