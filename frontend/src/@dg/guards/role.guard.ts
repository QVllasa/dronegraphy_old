import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanLoad {

  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const expectedRole = route.data.expectedRole;
      return this.afAuth.idTokenResult.pipe(
          map(token => {
              const roles = token.claims["roles"] as Array<string>
             return roles.includes(expectedRole)
          }),
          tap(isAllowed => {
              if (!isAllowed){
                  this.router.navigate(['/']).then()
              }
          })
      )
  }

}
