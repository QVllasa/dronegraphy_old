import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {IUser, User} from "../models/user.model";
import {Observable, of} from "rxjs";
import {AuthenticationService} from "../services/auth.service";
import {Injectable} from "@angular/core";
import {catchError, switchMap, take, tap} from "rxjs/operators";
import {UserService} from "../services/user.service";
import firebase from "firebase";

@Injectable({
    providedIn: 'root'
})
export class AuthResolver implements Resolve<User> {

    constructor(private authService: AuthenticationService,
                private userService: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
        return this.authService.afAuth.authState.pipe(
            switchMap(user => {
                if (!user) {
                    this.authService.user$.next(null);
                    return of(null);
                }
                return this.userService.getUser(user.uid).pipe(
                    catchError(err => {
                        return of(null);
                    })
                );
            }),
            switchMap((user: IUser) => {

                if (!user) {
                    this.authService.user$.next(null);
                    return of(null);
                }
                this.authService.user$.next(new User().deserialize(user));
                return this.authService.afAuth.idTokenResult;
            }),
            switchMap((token: firebase.auth.IdTokenResult) => {
                if (!token) {
                    this.authService.user$.next(null);
                    return of(null);
                }
                return this.authService.user$.pipe(
                    tap(user => {
                        if (!user) {
                            return of(null);
                        }
                        user.setClaims(Object.assign(token.claims));
                    })
                );
            }),
            take(1),
        );
    }

}
