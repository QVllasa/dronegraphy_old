import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import icMail from '@iconify/icons-ic/twotone-mail';
import {AuthenticationService} from '../../../../@dg/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {UserService} from "../../../../@dg/services/user.service";

@Component({
    selector: 'vex-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    animations: []
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

    form = this.fb.group({
        email: [null, Validators.required]
    });

    isLoading: boolean = false;
    resetSuccess: boolean = false;
    checkUser$: Subscription;

    icMail = icMail;

    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        private router: Router,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {}

    send() {
        if (this.userService.user$.value) {
            this._snackBar.open('Bitte erst abmelden.', 'SCHLIESSEN');
            this.router.navigate(['/']).then();
            return;
        }
        this.isLoading = true;
        this.form.disable();
        const email = this.form.get('email').value;


        this.authService.afAuth.sendPasswordResetEmail(email)
            .then(
                () => {
                    this.form.enable();
                    this.resetSuccess = true;
                    this.isLoading = false;
                })
            .catch(error => {
                this.form.enable();
                this.isLoading = false;
                switch (error.code) {
                    case 'auth/user-not-found': {
                        this._snackBar.open('Pilot nicht gefunden.', 'SCHLIESSEN');
                        break;
                    }
                    default: {
                        this._snackBar.open('Unbekannter Fehler', 'SCHLIESSEN');
                    }
                }
            });
    }

    ngOnDestroy() {
        // this.checkUser$.unsubscribe();
    }
}

