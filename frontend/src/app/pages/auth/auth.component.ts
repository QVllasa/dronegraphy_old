import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFireAuth} from "@angular/fire/auth";
import {AuthenticationService} from "../../../@vex/services/auth.service";

@Component({
    selector: 'vex-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    form: FormGroup;
    isLoading: boolean;
    inputType = 'password';
    visible = false;


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
        this.authService.signIn(email, password)
            .then(res => {
            console.log(res);
            this.isLoading = false;
            this.router.navigate(['/']);})
            .catch(err => {
            this.isLoading = false;
            console.log(err);
            if (err.code === 'auth/user-not-found'){
                this._snackBar.open('Pilot nicht gefunden.', 'SCHLIESSEN');
            }else {
                this._snackBar.open('Unbekannter Fehler', 'SCHLIESSEN');
            }});
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

}
