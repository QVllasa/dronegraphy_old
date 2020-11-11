import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {IUser} from "../interfaces/user.interface";
import {AngularFireAuth} from "@angular/fire/auth";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    user = new BehaviorSubject<IUser>(null);

    constructor(public auth: AngularFireAuth) {
    }

    signUp (email, password, name?){
        return this.auth.createUserWithEmailAndPassword(email, password);

    }

    signIn(email: string, password: string){
        return this.auth.signInWithEmailAndPassword(email, password);
    }
}
