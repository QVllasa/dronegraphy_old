import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IUser, User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {AngularFireAuth} from "@angular/fire/auth";
import {switchMap, take, takeWhile, tap} from "rxjs/operators";
import {BehaviorSubject, concat, from, Observable, of} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "./auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    form: FormGroup;


    constructor(private http: HttpClient,
                private authService: AuthenticationService,
                private userService: UserService,
                private _snackBar: MatSnackBar,
                private afAuth: AngularFireAuth) {
        this.form = this.initForm();
        this.userService.user$
            .pipe(
                takeWhile(user => !user, true),
                takeWhile(() => !this.currentUser, true)
            )
            .subscribe(user => {
                if (!user) {
                    return
                } else if (!this.currentUser) {
                    this.currentUser = user;
                    this.form.patchValue({
                        info: {
                            email: this.currentUser.email,
                            firstName: this.currentUser.firstName,
                            lastName: this.currentUser.lastName,
                        },
                    })
                    return
                }
            })
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

    changePassword(newPassword): Observable<void> {
        if ((newPassword != '') && !this.form.get('password').invalid) {
            return this.afAuth.authState.pipe(
                switchMap(res => {
                        return from(res.updatePassword(newPassword));
                    }
                )
            )
        }
        return of(null)
    }


    sendChanges() {
        this.form.disable()
        if (this.form.get('info').invalid) {
            this.form.get('password').enable()
            this._snackBar.open('Bitte korrekt ausfüllen.', 'SCHLIESSEN');
            return
        }

        const newEmail = this.form.get('info.email').value
        const newPassword = this.form.get('password').value
        const lastName = this.form.get('info.lastName').value;
        const firstName = this.form.get('info.firstName').value;

        this.currentUser.email = newEmail;
        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;

        const changeUserInfo$ = this.changeUserInfo(this.currentUser).pipe(take(1));
        const changeEmail$ = this.changeUserEmail(this.currentUser).pipe(take(1));
        const changePw$ = this.changePassword(newPassword).pipe(take(1));

        const combined$ = concat(
            changeEmail$,
            changeUserInfo$,
            changePw$
        )

        combined$.subscribe(() => {
                this.form.get('password').enable()


                this.form.patchValue({
                    info: {
                        email: this.currentUser.email,
                        firstName: this.currentUser.firstName,
                        lastName: this.currentUser.lastName,
                    },
                    password: ''
                })
                this._snackBar.open('Benutzerdaten aktualisiert.', 'SCHLIESSEN')
            },
            err => {
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
            });
    }


}
