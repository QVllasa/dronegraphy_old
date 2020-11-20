// import { Injectable } from '@angular/core';
// import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
// import { Observable } from 'rxjs';
// import {AuthenticationService} from "../services/auth.service";
// import {map, take, tap} from "rxjs/operators";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate {
//
//   constructor(private authService: AuthenticationService, private router: Router) {
//   }
//
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return this.authService.user$.pipe(
//         take(1),
//         map(user => !!(user && user.roles.admin && user.roles.creator)),
//         tap(isAllowed => {
//           if (!isAllowed){
//             console.log('Access denied');
//             this.router.navigate(['/']);
//           }
//         })
//     );
//   }
//
// }
