import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import icMail from '@iconify/icons-ic/twotone-mail';
import {AuthenticationService} from "../../../../@dg/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'vex-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    animations: []
})
export class ForgotPasswordComponent implements OnInit {

    form = this.fb.group({
        email: [null, Validators.required]
    });

    isLoading: boolean = false;
    resetSuccess: boolean = false;

    icMail = icMail;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
    }

    send() {
        this.isLoading = true;
        this.form.disable()
        const email = this.form.get('email').value;
        console.log(email)

        this.authService.afAuth.sendPasswordResetEmail(email)
            .then(
                () => {
                    this.form.enable()
                    this.resetSuccess = true;
                    this.isLoading = false;
                })
            .catch(error => {
                console.log(error.code)
                this.form.enable()
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
            })
    }
}

