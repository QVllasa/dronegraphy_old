import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, from, of, Subscription} from 'rxjs';
import {IUser, Member} from '../models/user.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import firebase from 'firebase';
import {MatSnackBar} from '@angular/material/snack-bar';
import {getFirstName, getLastName} from '../utils/split-names';
import {OrderService} from './order.service';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {


    logout$: Subscription;
    stayLoggedIn = false;


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

        return this.userService.registerUser(user, password).pipe(
            take(1),
            switchMap(res => {
                return this.handleLogin(user.email, password);
            }),
            switchMap(res => {
                return this.afAuth.authState;
            }),
            switchMap(user => {
                return from(user.sendEmailVerification());
            })
        );

        // return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
        //     switchMap(res => {
        //         const userData: IUser = {
        //             uid: res.user.uid,
        //             email: res.user.email,
        //             firstName: getFirstName(name),
        //             lastName: getLastName(name),
        //         };
        //         return this.userService.createUser(userData);  // POST
        //     }),
        //     switchMap(user => {
        //         return this.userService.getUser(user.uid);  // GET
        //     }),
        //     switchMap(user => {
        //         this.userService.user$.next(new User().deserialize(user));
        //         return this.afAuth.authState;
        //     }),
        //     switchMap(state => {
        //         state.sendEmailVerification();
        //         return from(state.getIdTokenResult(true));
        //     }),
        //     switchMap(token => {
        //         return this.userService.user$.pipe(
        //             map(user => {
        //                 user.setClaims(Object.assign(token.claims));
        //             })
        //         );
        //     }),
        // );
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
            switchMap(res => {
                return this.userService.getUser(res.user.uid);
            }),
            switchMap(user => {
                this.userService.user$.next(new Member().deserialize(user));
                if (this.stayLoggedIn) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return this.afAuth.idTokenResult;
            }),
            switchMap(token => {
                if (this.stayLoggedIn) {
                    localStorage.setItem('idToken', JSON.stringify(token.token));
                }
                return this.userService.user$.pipe(
                    map(user => {
                        user.setClaims(Object.assign(token.claims));
                    })
                );
            })
        );
    }


    ngOnDestroy() {
        if (this.logout$) {
            this.logout$.unsubscribe();
        }
    }


}
