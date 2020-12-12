import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IUser, User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {AngularFireAuth} from "@angular/fire/auth";
import {switchMap, take, tap} from "rxjs/operators";
import {BehaviorSubject, concat, from, Observable, of} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);


    constructor(private http: HttpClient,
                private _snackBar: MatSnackBar,
                private afAuth: AngularFireAuth) {
    }

    initForm() {
        return new FormGroup({
            info: new FormGroup({
                firstName: new FormControl({
                    value: '',
                    disabled: true
                }, [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-Z ]*')]),
                lastName: new FormControl({
                    value: '',
                    disabled: true
                }),
                email: new FormControl({
                    value: '',
                    disabled: true
                }, [Validators.required, Validators.email]),
                slogan: new FormControl({
                    value: '',
                    disabled: true,
                })
            }),
            password: new FormControl({
                value: '',
                disabled: false
            }, [Validators.minLength(8)]),
        })
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
                user.delete().then();
            })).subscribe()


    }

    changeUserInfo(user: User): Observable<IUser | null> {
        return this.updateUser(user)
    }

    changeUserEmail(user: User): Observable<void> {
        return this.afAuth.authState.pipe(
            switchMap((res) => {
                return from(res.updateEmail(user.email))
            })
        )
    }

    changePassword(newPassword, form): Observable<void> {
        if ((newPassword != '') && !form.get('password').invalid) {
        return this.afAuth.authState.pipe(
            switchMap(res => {
                    return from(res.updatePassword(newPassword));
                }
            )
        )
        }
        return of(null)
    }


    sendChanges(form: FormGroup) {
        form.disable()
        if (form.get('info').invalid) {
            form.get('password').enable()
            this._snackBar.open('Bitte korrekt ausfüllen.', 'SCHLIESSEN');
            return
        }

        const newEmail = form.get('info.email').value
        const newPassword = form.get('password').value
        const lastName = form.get('info.lastName').value;
        const firstName = form.get('info.firstName').value;

        this.user$.value.email = newEmail;
        this.user$.value.firstName = firstName;
        this.user$.value.lastName = lastName;

        const changeUserInfo$ = this.changeUserInfo(this.user$.value).pipe(take(1));
        const changeEmail$ = this.changeUserEmail(this.user$.value).pipe(take(1));
        const changePw$ = this.changePassword(newPassword, form).pipe(take(1));

        return concat(
            changeEmail$,
            changeUserInfo$,
            changePw$
        )
    }

    handleForm(form){
        form.get('password').enable()
        form.patchValue({
            info: {
                email: this.user$.value.email,
                firstName: this.user$.value.firstName,
                lastName: this.user$.value.lastName,
            },
            password: ''
        })
        this._snackBar.open('Benutzerdaten aktualisiert.', 'SCHLIESSEN')
    }

    handleError(err){
        if (err) {
            switch (err.code) {
                case 'auth/requires-recent-login': {
                    this._snackBar.open('Bitte melde dich erst kurz neu an.', 'SCHLIESSEN');
                    break;
                }
                case 'auth/email-already-in-use': {
                    this._snackBar.open('Diese E-Mail wird schon verwendet.', 'SCHLIESSEN');
                    break;
                }
                case 'auth/invalid-email': {
                    this._snackBar.open('E-Mail Adresse unzulässig.', 'SCHLIESSEN');
                    break;
                }
                default: {
                    this._snackBar.open('Unbekannter Fehler', 'SCHLIESSEN');
                }
            }
        }
    }


}
