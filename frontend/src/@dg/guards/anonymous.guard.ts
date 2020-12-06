import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from "@angular/fire/auth";
import {map, take, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.afAuth.authState.pipe(
        take(1),
        map(user => !user),
        tap(isLoggedIn => {
          if (!isLoggedIn){
            console.log("not loggedIn")
            console.log('access denied!');
            this.router.navigate(['/']).then();
          }
        })
    );
  }
}
