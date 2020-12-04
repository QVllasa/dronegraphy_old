import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {Observable, Subscription} from "rxjs";


@Component({
    selector: 'dg-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

    form: FormGroup;
    isLoading: boolean;
    inputType = 'password';
    visible = false;
    loginProcess$: Subscription;


    constructor(private router: Router,
                private fb: FormBuilder,
                private cd: ChangeDetectorRef,
                private authService: AuthenticationService,
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
        this.isLoading = true;
        const email = this.form.get('email').value;
        const password = this.form.get('password').value;
        this.loginProcess$ = this.authService.login(email, password).subscribe(
            () => {
                this.isLoading = false;
                this.router.navigate(['/']);
            }, error => {
                this.isLoading = false;
                console.log(error);
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
            })
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
        this.loginProcess$.unsubscribe();
    }

}
