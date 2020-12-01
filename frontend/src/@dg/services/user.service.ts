import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IUser} from "../interfaces/user.interface";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./auth.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {switchMap, tap} from "rxjs/operators";
import {Subscription} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy{

    deleteUser$: Subscription


    constructor(private http: HttpClient,
                private afAuth: AngularFireAuth) {
    }

    getUser(uid) {
        return this.http.get<IUser>(environment.apiUrl + '/users/' + uid);
    }

    updateUser(user: IUser) {
        return this.http.put<IUser>(environment.apiUrl + '/users/' + user.uid, user).toPromise();
    }

    deleteUser() {
        this.deleteUser$ = this.afAuth.authState.pipe(
            tap(user => {
                if (!user){
                    return
                }
                return user.delete().then(res=> {
                    console.log(res);
                    console.log("user deleted")
                });
            })).subscribe()


    }

    ngOnDestroy() {
        this.deleteUser$.unsubscribe();
    }
}
