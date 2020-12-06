import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IUser, User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {AngularFireAuth} from "@angular/fire/auth";
import {take, tap} from "rxjs/operators";




@Injectable({
    providedIn: 'root'
})
export class UserService {




    constructor(private http: HttpClient,
                private afAuth: AngularFireAuth) {
    }


    createUser(user: IUser) {
        return this.http.post<IUser>(environment.apiUrl + '/users', user);
    }

    getUser(uid) {
        return this.http.get<IUser>(environment.apiUrl + '/users/' + uid);
    }

    updateUser(user: User) {
        return this.http.put<IUser>(environment.apiUrl + '/users/' + user.uid, user);
    }

    deleteUser() {
        this.afAuth.authState.pipe(
            take(1),
            tap(user => {
                if (!user) {
                    return
                }
                user.delete().then(res => {
                    console.log(res);
                    console.log("user deleted")
                });
            })).subscribe()


    }


}
