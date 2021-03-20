import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, from, iif, Observable, of, Subscription} from 'rxjs';
import {IUser, User} from '../models/user.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import firebase from 'firebase';
import {MatSnackBar} from '@angular/material/snack-bar';
import {getFirstName, getLastName} from '../utils/split-names';
import {OrderService} from './order.service';
import {IClaims} from '../models/JWTTokenDecoded.interface';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {


    logout$: Subscription;
    stayLoggedIn = false;
    cred: firebase.auth.UserCredential;
    claims: IClaims;


    constructor(public afAuth: AngularFireAuth,
                private http: HttpClient,
                private userService: UserService,
                private orderSerivce: OrderService,
                private _snackBar: MatSnackBar,
                private router: Router) {
    }

    // Sign Up User on Firebase
    signUp(email, password, name) {

        const user = {
            email,
            firstName: getFirstName(name),
            lastName: getLastName(name),
        };

        return this.userService.registerMember(user, password).pipe(
            take(1),
            switchMap(res => {
                console.log('from register', res);
                return this.handleLogin(user.email, password);
            }),
            switchMap(() => {
                return this.afAuth.authState;
            }),
            switchMap(res => {
                return from(res.sendEmailVerification());
            })
        );
    }

    login(email: string, password: string) {
        return this.handleLogin(email, password);
    }

    signOut() {
        this.orderSerivce.cart$.next(null);
        this.logout$ = from(this.afAuth.signOut()).pipe(
            switchMap(() => {
                localStorage.removeItem('currentUser');
                return this.router.navigate(['/']);
            }))
            .subscribe(
                () => {
                    this.userService.user$.next(null);

                },
                error => {
                    if (error) {
                        return of(null);
                    }
                }
            );
    }

    handleLogin(email: string, password: string) {
        return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
            // SignIn Firebase and return credentials
            switchMap(cred => {
                console.log('1. firebase', cred);
                this.cred = cred;
                return this.afAuth.idTokenResult;
            }),

            // Use Token after successful signing in Firebase
            switchMap(token => {
                this.claims = Object.assign(token.claims);
                return this.userService.getUser(this.cred.user.uid);
            }),

            // Fetch User Data from Backend
            map(user => {
                if (!user) {
                    this.userService.user$.next(null);
                    return of(null);
                }
                this.mapUser(user, this.claims);
            }),
        );
    }

    mapUser(user: IUser, claims: IClaims): User {
        let u: User;
        u = new User().deserialize(user);
        u.setClaims(claims);
        this.userService.user$.next(u);
        if (claims.role === ('ROLE_MEMBER')) {
            console.log('Logged in as MEMBER: ', u);
        } else if (claims.role === ('ROLE_CREATOR')) {
            console.log('Logged in as CREATOR: ', u);
        }
        return u;
    }

    ngOnDestroy() {
        if (this.logout$) {
            this.logout$.unsubscribe();
        }
    }

}
