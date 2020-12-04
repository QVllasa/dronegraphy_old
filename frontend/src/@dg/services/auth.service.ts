import {Injectable} from "@angular/core";
import {BehaviorSubject, from, of, Subscription} from "rxjs";
import {IUser, User} from "../models/user.model";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {map, switchMap, take, tap} from "rxjs/operators";
import firebase from "firebase";
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    user$: BehaviorSubject<User> = new BehaviorSubject<User>(null)
    token: firebase.auth.IdTokenResult;


    constructor(public afAuth: AngularFireAuth,
                private http: HttpClient,
                private userService: UserService,
                private _snackBar: MatSnackBar,
                private router: Router) {

        this.autoLogin()
            .subscribe(
                () => {
                },
                err => {
                    if (err) {
                        console.log(err)
                        this._snackBar.open('Server nicht erreichbar.', 'SCHLIESSEN', {
                            horizontalPosition: 'end',
                            verticalPosition: 'top',
                        });
                        indexedDB.deleteDatabase('firebaseLocalStorageDb')
                    }
                })

    }

    // Sign Up User on Firebase
    signUp(email, password, name) {
        return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
            switchMap(res => {
                const userData: IUser = {
                    uid: res.user.uid,
                    email: res.user.email,
                    firstName: this.getFirstName(name),
                    lastName: this.getLastName(name),
                }
                return this.userService.createUser(userData)
            }),
            switchMap(user => {
                this.user$.next(new User(user.uid, user.email, user.firstName, user.lastName))
                return this.afAuth.authState
            }),
            switchMap(state => {
                return from(state.getIdTokenResult(true))
            }),
            switchMap(token => {
                return this.getRolesFromToken(token)
            })
        )
    }


    login(email: string, password: string) {
        return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
            switchMap(res => {
                return this.userService.getUser(res.user.uid)
            }),
            switchMap(user => {
                this.user$.next(new User(user.uid, user.email, user.firstName, user.lastName))
                return this.afAuth.idTokenResult
            }),
            switchMap(token => {
                return this.getRolesFromToken(token)
            })
        )

    }

    autoLogin() {
        return this.afAuth.authState.pipe(
            take(1),
            switchMap(user => {
                if (user) {
                    return this.userService.getUser(user.uid);
                } else {
                    this.user$.next(null)
                    return of(null)
                }
            }),
            switchMap(user => {
                if (!user) {
                    return of(null)
                }
                this.user$.next(new User(user.uid, user.email, user.firstName, user.lastName))
                return this.afAuth.idTokenResult;

            }),
            switchMap(token => {
                if (!token) {
                    return of(null)
                }
                return this.getRolesFromToken(token)
            })
        )
    }

    signOut() {
        const logOut$ = from(this.afAuth.signOut()).pipe(
            tap(
                () => {
                    this.user$.next(null);
                    this.router.navigate(['/']);
                },
                error => console.log(error)
            )
        )
        logOut$.subscribe()
    }

    getFirstName(name) {
        let firstName: string;
        if (name.indexOf(' ') >= 0) {
            firstName = name.substr(0, name.indexOf(' '));
        } else {
            firstName = name;
        }
        return firstName
    }

    getLastName(name) {
        let lastName: string;
        if (name.indexOf(' ') >= 0) {
            lastName = name.substr(name.indexOf(' ') + 1);
        } else {
            lastName = '';
        }
        return lastName
    }


    getRolesFromToken(token: firebase.auth.IdTokenResult) {
        console.log("tap claims")
        console.log(token.token)
        console.log(token.claims)
        return this.user$.pipe(
            map(user => {
                user.setRoles(token.claims["roles"])
            })
        )
    }


}
