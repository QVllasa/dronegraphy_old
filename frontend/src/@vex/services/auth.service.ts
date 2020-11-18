import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {IUser} from "../interfaces/user.interface";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {map, switchMap} from 'rxjs/operators';
import {Router} from "@angular/router";
import {AngularFireFunctions} from "@angular/fire/functions";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Roles} from "../../app/pages/auth/auth.component";
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    user$: Observable<IUser>;

    constructor(public afAuth: AngularFireAuth,
                private http: HttpClient,
                private router: Router,
                private fns: AngularFireFunctions) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return of(null)
                } else {
                    return of(null);
                }
            })
        )
    }


    // Sign Up User on Firebase
    signUp(email, password, name) {
        console.log("1. Promise returned")
        return this.afAuth.createUserWithEmailAndPassword(email, password)
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
        return this.http.post(environment.apiUrl + '/users', userData).toPromise();
    }

    signIn(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    verifyUser() {
        this.afAuth.idTokenResult.subscribe(
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

    updateUserData(user, firstName, lastName) {
        // const userRef: AngularFirestoreDocument<IUser> = this.afs.doc<IUser>(`users/${user.uid}`);
        const userData: IUser = {
            uid: user.uid,
            email: user.email,
            firstName: firstName,
            lastName: lastName,
        }
        console.log("userData:", userData)
        // return userRef.set(userData, {merge: true});
    }


}
