import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../../@dg/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../../../@dg/services/user.service';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
    selector: 'dg-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

    form: FormGroup;
    signUp$: Subscription;

    // particlesOptions = particleConfig;
    isLoading: boolean;
    inputType = 'password';
    visible = false;
    registerSuccess = false;
    checkUser$: Subscription;


    constructor(private router: Router,
                private userService: UserService,
                private fb: FormBuilder,
                private cd: ChangeDetectorRef,
                public authService: AuthenticationService,
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
        if (this.userService.user$.value) {
            this._snackBar.open('Du bist bereits angemeldet.', 'SCHLIESSEN');
            this.router.navigate(['/']).then();
            return;
        }
        this.isLoading = true;
        const name = this.form.get('name').value.trim();
        const email = this.form.get('email').value;
        const password = this.form.get('password').value.trim();

        this.signUp$ = this.authService.signUp(email, password, name)
            .subscribe(res => {
                    this.isLoading = false;
                    this.registerSuccess = true;
                },
                error => {
                    console.log(error)
                    this.isLoading = false;
                    if (error.code === 'auth/email-already-in-use') {
                        this._snackBar.open('Pilot existiert bereits.', 'SCHLIESSEN');
                    } else {
                        this.userService.deleteUser();
                        this._snackBar.open('Register: Unbekannter Fehler', 'SCHLIESSEN');
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
        if (this.signUp$) {
            this.signUp$.unsubscribe();
        }

        // this.checkUser$.unsubscribe();
    }


}
