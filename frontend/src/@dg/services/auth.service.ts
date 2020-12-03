import {Injectable} from "@angular/core";
import {BehaviorSubject, of} from "rxjs";
import {IUser, User} from "../models/user.model";
import {AngularFireAuth} from "@angular/fire/auth";

import {first, switchMap, take} from 'rxjs/operators';
import {Router} from "@angular/router";
import {AngularFireFunctions} from "@angular/fire/functions";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {UserService} from "./user.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {defaultRoles} from "../models/role.interface";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    user$: BehaviorSubject<User> = new BehaviorSubject<User>(null)


    constructor(public afAuth: AngularFireAuth,
                private http: HttpClient,
                private userService: UserService,
                private router: Router) {

    }

    // Sign Up User on Firebase
    signUp(email, password, name) {
        let firstName: string, lastName: string;
        if (name.indexOf(' ') >= 0) {
            firstName = name.substr(0, name.indexOf(' '));
            lastName = name.substr(name.indexOf(' ') + 1);
        } else {
            firstName = name;
            lastName = '';
        }

        return this.afAuth.createUserWithEmailAndPassword(email, password)
            .then(res => {

                //TODO An anderer stelle E-Mail verschicken.
                res.user.sendEmailVerification().;

                return this.registerUser(res.user, firstName, lastName)
            })
            .then(user => {
                this.user$.next(new User(user.uid, user.email, user.firstName, user.lastName))
                return this.afAuth.idToken.pipe(first()).toPromise();
            }).then(token => {
                this.user$.value.setToken(token)
            })
    }

    // Store User Data in Backend
    registerUser(user, firstName, lastName) {
        const userData: IUser = {
            uid: user.uid,
            email: user.email,
            firstName: firstName,
            lastName: lastName,
        }
        return this.userService.createUser(userData);
    }

    login(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .then(res => {
                return this.userService.getUser(res.user.uid)
            })
            .then(user => {
                this.user$.next(new User(user.uid, user.email, user.firstName, user.lastName))
                return this.afAuth.idToken.pipe(first()).toPromise();
            }).then(token => {
                console.log("setting token")
                this.user$.value.setToken(token)
                console.log(this.user$.value.getClaims())
            })
    }

    signOut() {
        this.afAuth.signOut()
            .then(() => {
                this.user$.next(null);
                this.router.navigate(['/']);
            })
            .catch(err => {
                console.log(err);
            });
    }

    autoLogin(): Promise<IUser | null> {
        return this.afAuth.authState.pipe(first()).toPromise().then(user => {
            if (user) {
                return this.userService.getUser(user.uid);
            } else {
                this.user$.next(null)
                return of(null).toPromise()
            }
        })
    }
}
