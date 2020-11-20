import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../services/auth.service";
import {map, take, tap} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private afAuth: AngularFireAuth, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.afAuth.authState.pipe(
            take(1),
            map(user => !!user),
            tap(isLoggedIn => {
                if (!isLoggedIn){
                    console.log("loggedIn")
                    console.log('access denied!');
                    this.router.navigate(['/login']);
                }
            })
        );
    }

}
