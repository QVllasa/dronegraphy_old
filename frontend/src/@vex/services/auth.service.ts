import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, of} from "rxjs";
import {IUser} from "../interfaces/user.interface";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {first, map, take} from 'rxjs/operators';
import {Router} from "@angular/router";
import {AngularFireFunctions} from "@angular/fire/functions";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Roles} from "../../app/pages/auth/auth.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "./user.service";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    user$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null)

    constructor(public afAuth: AngularFireAuth,
                private http: HttpClient,
                private userService: UserService,
                private router: Router,
                private fns: AngularFireFunctions) {

        //TODO append idToken to Authorization Header with interceptor
        this.afAuth.authState
            .pipe(
                take(1),
                map(user => {
                    if (!user){
                        this.user$.next(null)
                        console.log("no user logged in");
                        return
                    }
                    return user
                })
            ).subscribe(user => {
                console.log(user.uid)
            this.userService.getUser(user.uid).then( res => {
                this.user$.next(res);
            }).catch(err => console.log(err))
        })
    }

    // Sign Up User on Firebase
    signUp(email, password, name) {
        const firstName = name.substr(0, name.indexOf(' '));
        const lastName = name.substr(name.indexOf(' ') + 1);
        console.log("1. Promise returned")
        return this.afAuth.createUserWithEmailAndPassword(email, password)
            .then(res => {
                console.log("1. then")
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
        console.log("register")
        console.log(userData)
        console.log("2. Promise returned")
        return this.http.post<IUser>(environment.apiUrl + '/users', userData).toPromise();
    }


    signIn(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    verifyUser() {
        this.afAuth.idToken.subscribe(
            res => {
                console.log(res);
            },
            err => {
                console.log(err);
            }
        )

    }

    async signOut() {
        await this.afAuth.signOut();
        return this.router.navigate(['/']);
    }


//        autoLogin() {
//         const userData: StoredData = JSON.parse(localStorage.getItem('userData'));
//         if (!userData) {
//             return;
//         }
//         const loadedUser = new User(
//             userData.id,
//             userData.firstName,
//             userData.lastName,
//             userData.email,
//             userData.roles,
//             userData._token,
//             new Date(userData._tokenExpirationDate));
//
//         if (loadedUser.token) {
//             this.user.next(loadedUser);
//             const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
//             this.router.navigate(['']);
//             this.autoLogout(expirationDuration);
//         }
//     }
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
