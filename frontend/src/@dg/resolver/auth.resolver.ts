import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {IUser, User} from '../models/user.model';
import {Observable, of} from 'rxjs';
import {AuthenticationService} from '../services/auth.service';
import {Injectable} from '@angular/core';
import {catchError, switchMap, take, tap} from 'rxjs/operators';
import {UserService} from '../services/user.service';
import firebase from 'firebase';
import {IClaims} from '../models/JWTTokenDecoded.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthResolver implements Resolve<User> {

    fbUser: firebase.User;
    claims: IClaims;

    constructor(private authService: AuthenticationService,
                private userService: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
        return this.authService.afAuth.authState.pipe(
            switchMap(user => {
                if (!user) {
                    this.userService.user$.next(null);
                    return of(null);
                }
                this.fbUser = user;
                return this.authService.afAuth.idTokenResult;
            }),
            switchMap((token: firebase.auth.IdTokenResult) => {
                if (!token) {
                    this.userService.user$.next(null);
                    return of(null);
                }
                console.log('token: ', token.token);
                this.claims = Object.assign(token.claims);
                return this.userService.getUser(this.fbUser.uid);
            }),
            switchMap((user) => {
                if (!user) {
                    this.userService.user$.next(null);
                    return of(null);
                }
                const u = this.authService.mapUser(user, this.claims);
                return of(u);
            }),
            take(1)
        );
    }

}
