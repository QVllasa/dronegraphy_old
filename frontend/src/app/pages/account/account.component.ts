import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {IUser, User} from "../../../@dg/models/user.model";
import { switchMap, take, takeWhile} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";
import {MatSnackBar} from "@angular/material/snack-bar";

import {UserService} from "../../../@dg/services/user.service";
import {concat, from, Observable, of} from "rxjs";


@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    orders: { amount: number, date: number, method: string }[] = [
        {
            amount: 5,
            date: new Date().getDate(),
            method: 'PayPal'
        },
        {
            amount: 5,
            date: new Date().getDate(),
            method: 'PayPal'
        },
        {
            amount: 5,
            date: new Date().getDate(),
            method: 'PayPal'
        }
    ];

    form: FormGroup;
    currentUser: User = null;
    isLoading: boolean;

    inputType = 'password';
    visible = false;

    constructor(private fb: FormBuilder,
                private afAuth: AngularFireAuth,
                private _snackBar: MatSnackBar,
                private userService: UserService,
                public authService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.isLoading = false
        this.initForm();
        this.authService.user$
            .pipe(
                takeWhile(user => !user, true),
                takeWhile(() => !this.currentUser, true)
            )
            .subscribe(user => {
                console.log("get new user from stream", user)
                if (!user) {
                    return
                } else if (!this.currentUser) {
                    this.currentUser = user;
                    console.log("patch form")
                    console.log(this.currentUser)
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
        console.log("init form")
        this.form = new FormGroup({
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
            }),
            password: new FormControl({
                value: '',
                disabled: false
            }, [Validators.minLength(8)]),
        })
    }

    changeUserInfo(user: User): Observable<IUser | null> {
        return this.userService.updateUser(user)
    }

    changeUserEmail(user: User): Observable<void> {
        return this.afAuth.authState.pipe(
            switchMap((res) => {
                return from(res.updateEmail(user.email))
            })
        )
    }

    changePassword(newPassword): Observable<void> {
        console.log("new password")
        if ((newPassword != '') && !this.form.get('password').invalid) {
            return this.afAuth.authState.pipe(
                switchMap(res => {
                    console.log("changing password")
                        return from(res.updatePassword(newPassword));
                    }
                )
            )
        }
        return of(null)
    }

    send() {
        this.form.disable()
        if (this.form.get('info').invalid) {
            this.form.get('password').enable()
            this._snackBar.open('Bitte korrekt ausfüllen.', 'SCHLIESSEN');
            return
        }
        this.isLoading = true;
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
                console.log("finish")
                this.isLoading = false;
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
                    this.isLoading = false;
                    console.log(err);
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

    togglePassword() {
        if (this.visible) {
            this.inputType = 'password';
            this.visible = false;
            // this.cd.markForCheck();
        } else {
            this.inputType = 'text';
            this.visible = true;
            // this.cd.markForCheck();
        }
    }

    onActivateForm(type) {
        this.form.get('info.' + type).enable();
    }

    onDeactivateForm(type) {
        this.form.get('info.' + type).disable();
    }



}
