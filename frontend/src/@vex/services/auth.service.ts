import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {IUser} from "../interfaces/user.interface";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {first, map, mergeMap, switchMap, take} from 'rxjs/operators';
import {Router} from "@angular/router";
import {AngularFireFunctions} from "@angular/fire/functions";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Roles} from "../../app/pages/auth/auth.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "./user.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {JWTTokenDecoded} from "../interfaces/JWTTokenDecoded.interface";

const helper = new JwtHelperService();

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    user$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null)
    token: string = "";

    constructor(public afAuth: AngularFireAuth,
                private http: HttpClient,
                private userService: UserService,
                private router: Router,
                private fns: AngularFireFunctions) {
        this.autoLogin();
    }

    // Sign Up User on Firebase
    signUp(email, password, name) {
        const firstName = name.substr(0, name.indexOf(' '));
        const lastName = name.substr(name.indexOf(' ') + 1);
        return this.afAuth.createUserWithEmailAndPassword(email, password)
            .then(res => {
                return this.registerUser(res.user, firstName, lastName)
            })
            .then(res => {
                this.user$.next(res)
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
        console.log(userData)
        return this.http.post<IUser>(environment.apiUrl + '/users', userData).toPromise();
    }


    login(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .then(res => {
                return this.userService.getUser(res.user.uid).toPromise()
            })
            .then(user => {
                this.user$.next(user)
            });
    }

    // verifyUser() {
    //     this.afAuth.idToken.subscribe(
    //         res => {
    //             console.log(res);
    //         },
    //         err => {
    //             console.log(err);
    //         }
    //     )
    //
    // }

    signOut() {
        console.log("click on sign out")
        this.afAuth.signOut()
            .then(() => {
                this.router.navigate(['/']);
            })
            .catch(err => {
                console.log(err);
            });

    }


    autoLogin() {
        const idToken$ = this.afAuth.idToken;
        const authState$ = this.afAuth.authState;

        //                    this.token = token
        //                     const decodedToken: JWTTokenDecoded = helper.decodeToken(token)

        this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    console.log(user)
                    return this.userService.getUser(user.uid)
                } else {
                    this.user$.next(null)
                    return of(null)
                }
            })
        )
            .subscribe(user => {
                this.user$.next(user)
            })
    }

//
//     logout() {
//         this.user.next(null);
//         this.router.navigate(['/login']);
//         localStorage.removeItem('userData');
//         if (this.tokenExpirationTimer) {
//             clearTimeout(this.tokenExpirationTimer);
//         }
//         this.tokenExpirationTimer = null;
//     }
//
//     autoLogout(expirationDuration: number) {
//         this.tokenExpirationTimer = setTimeout(() => {
//             this.logout();
//         }, expirationDuration);
//     }


}
