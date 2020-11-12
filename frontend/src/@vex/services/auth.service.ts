import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, of} from "rxjs";
import {IUser} from "../interfaces/user.interface";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";

import {switchMap} from 'rxjs/operators';
import {Router} from "@angular/router";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    user$: Observable<IUser>;

    constructor(public afAuth: AngularFireAuth,
                private afs: AngularFirestore, private router: Router) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<IUser>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        )
    }


    signUp(email, password) {
        return this.afAuth.createUserWithEmailAndPassword(email, password)
    }

    signIn(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    async signOut() {
        await this.afAuth.signOut();
        return this.router.navigate(['/']);
    }

    updateUserData(user, firstName, lastName) {
        const userRef: AngularFirestoreDocument<IUser> = this.afs.doc<IUser>(`users/${user.uid}`);
        const userData: IUser = {
            uid: user.uid,
            email: user.email,
            firstName: firstName,
            lastName: lastName,
        }
        return userRef.set(userData, {merge: true});
    }
}
