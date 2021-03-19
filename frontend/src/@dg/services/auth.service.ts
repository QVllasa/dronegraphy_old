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
            switchMap(res => {
                console.log('1. firebase', res);
                return this.userService.getMember(res.user.uid);
            }),
            switchMap(user => {
                console.log('2. backend', user);
                const u = new Member().deserialize(user);
                this.userService.user$.next(u);
                return this.afAuth.idTokenResult;
            }),
            switchMap(token => {
                console.log('3. firebase', token);
                return this.userService.user$.pipe(
                    map(user => {
                        console.log('4. frontend', user);
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
