import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, from, of, Subscription} from 'rxjs';
import {IUser, User} from '../models/user.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import firebase from 'firebase';
import {MatSnackBar} from '@angular/material/snack-bar';
import {getFirstName, getLastName} from '../utils/split-names';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {


    logout$: Subscription;
    stayLoggedIn = false;


    constructor(public afAuth: AngularFireAuth,
                private http: HttpClient,
                private userService: UserService,
                private _snackBar: MatSnackBar,
                private router: Router) {
    }

    // Sign Up User on Firebase
    signUp(email, password, name) {
        return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
            switchMap(res => {
                const userData: IUser = {
                    uid: res.user.uid,
                    email: res.user.email,
                    firstName: getFirstName(name),
                    lastName: getLastName(name),
                };
                return this.userService.createUser(userData);  // POST
            }),
            switchMap(user => {
                return this.userService.getUser(user.uid);  // GET
            }),
            switchMap(user => {
                this.userService.user$.next(new User().deserialize(user));
                return this.afAuth.authState;
            }),
            switchMap(state => {
                state.sendEmailVerification();
                return from(state.getIdTokenResult(true));
            }),
            switchMap(token => {
                return this.userService.user$.pipe(
                    map(user => {
                        user.setClaims(Object.assign(token.claims));
                    })
                );
            }),
        );
    }


    login(email: string, password: string) {
        return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
            switchMap(res => {
                return this.userService.getUser(res.user.uid);
            }),
            switchMap(user => {
                this.userService.user$.next(new User().deserialize(user));
                if (this.stayLoggedIn){
                    localStorage.setItem("currentUser", JSON.stringify(user))
                }

                return this.afAuth.idTokenResult;
            }),
            switchMap(token => {
                if (this.stayLoggedIn){
                    localStorage.setItem("idToken", JSON.stringify(token.token))
                }
                return this.userService.user$.pipe(
                    map(user => {
                        user.setClaims(Object.assign(token.claims));
                    })
                );
            })
        );
    }

    // TODO fix autologin after registration (works perfectly on login)
    /*autoLogin() {
        return this.afAuth.authState.pipe(
            switchMap(user => {
                if (!user) {
                    this.user$.next(null);
                    return of(null);
                }
                return this.userService.getUser(user.uid).pipe(
                    catchError(err => {
                        return of(null);
                    })
                );
            }),
            switchMap(user => {
                if (!user) {
                    this.user$.next(null);
                    return of(null);
                }
                this.user$.next(new User(user.uid, user.email, user.firstName, user.lastName));
                return this.afAuth.idTokenResult;
            }),
            switchMap(token => {
                if (!token) {
                    this.user$.next(null);
                    return of(null);
                }
                return this.user$.pipe(
                    tap(user => {
                        if (!user) {
                            return of(null);
                        }
                        user.setClaims(Object.assign(token.claims));
                    })
                );
            })
        );
    }*/



    signOut() {
        this.logout$ = from(this.afAuth.signOut()).pipe(
            switchMap(() => {
                localStorage.removeItem('currentUser')
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


    ngOnDestroy() {
        if (this.logout$) {
            this.logout$.unsubscribe();
        }
    }


}
