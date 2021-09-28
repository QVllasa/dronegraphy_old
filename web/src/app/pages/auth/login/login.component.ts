import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthenticationService} from '../../../../@dg/services/auth.service';
import {Subscription} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {UserService} from '../../../../@dg/services/user.service';


@Component({
    selector: 'dg-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    form: FormGroup;
    isLoading: boolean;
    inputType = 'password';
    visible = false;
    loginProcess$: Subscription;


    constructor(private router: Router,
                private fb: FormBuilder,
                private cd: ChangeDetectorRef,
                public authService: AuthenticationService,
                private userService: UserService,
                private _snackBar: MatSnackBar
    ) {

    }

    ngOnInit() {
        this.isLoading = false;
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }


    send() {
        this.form.disable();
        if (this.userService.user$.value) {
            this.form.enable();
            this._snackBar.open('Bitte vorher abmelden.', 'SCHLIESSEN');
            return;
        }
        this.isLoading = true;
        const email = this.form.get('email').value;
        const password = this.form.get('password').value;

        this.loginProcess$ = this.authService.login(email, password)
            .pipe(
                switchMap(res => {
                    console.log('5. login component', res);
                    this.isLoading = false;
                    return this.router.navigate(['/']);
                })
            )
            .subscribe(
                () => {
                },
                error => {
                    console.log(error);
                    if (error) {
                        this.form.enable();
                        this.isLoading = false;
                        switch (error.code) {
                            case 'auth/user-not-found': {
                                this._snackBar.open('Pilot nicht gefunden.', 'SCHLIESSEN');
                                break;
                            }
                            case 'auth/wrong-password': {
                                this._snackBar.open('Passwort falsch.', 'SCHLIESSEN');
                                break;
                            }
                            default: {
                                this._snackBar.open('Unbekannter Fehler', 'SCHLIESSEN');
                            }
                        }
                    }

                });
    }

    toggleVisibility() {
        if (this.visible) {
            this.inputType = 'password';
            this.visible = false;
            this.cd.markForCheck();
        } else {
            this.inputType = 'text';
            this.visible = true;
            this.cd.markForCheck();
        }
    }

    ngOnDestroy() {
        if (this.loginProcess$) {
            this.loginProcess$.unsubscribe();
        }
        // this.checkUser$.unsubscribe();
    }

}
