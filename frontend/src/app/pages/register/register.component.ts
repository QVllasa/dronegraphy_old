import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {particleConfig} from "../../../../particle";
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Info} from "luxon";
import {UserService} from "../../../@dg/services/user.service";

@Component({
    selector: 'dg-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    form: FormGroup;

    particlesOptions = particleConfig;
    isLoading: boolean;
    inputType = 'password';
    visible = false;
    registerSuccess: boolean = false;


    constructor(private router: Router,
                private userService: UserService,
                private fb: FormBuilder,
                private cd: ChangeDetectorRef,
                private authService: AuthenticationService,
                private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-Z ]*')]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    send() {
        this.isLoading = true;
        const name = this.form.get('name').value.trim();
        const email = this.form.get('email').value;
        const password = this.form.get('password').value.trim();

        this.authService.signUp(email, password, name)
            .subscribe(() => {
                    this.isLoading = false;
                    this.registerSuccess = true;
                },
                error => {
                    this.isLoading = false;
                    if (error.code === 'auth/email-already-in-use') {
                        this._snackBar.open('Pilot existiert bereits.', 'SCHLIESSEN');
                    } else {
                        this.userService.deleteUser()
                        this._snackBar.open('Unbekannter Fehler', 'SCHLIESSEN');
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


}
