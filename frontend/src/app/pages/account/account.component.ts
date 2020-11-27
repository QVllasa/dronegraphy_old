import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {IUser} from "../../../@dg/interfaces/user.interface";
import {tap} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit, OnDestroy {

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
    currentUser: IUser = null;
    isLoading: boolean;

    inputType = 'password';
    visible = false;

    constructor(private fb: FormBuilder,
                private afAuth: AngularFireAuth,
                public authService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            if (!user) {
                return
            }
            this.currentUser = user;
            this.initForm();
        })

    }

    initForm() {
        this.form = new FormGroup({
            firstName: new FormControl({
                value: this.currentUser.firstName,
                disabled: true
            }, [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-Z ]*')]),
            lastName: new FormControl({
                value: this.currentUser.lastName,
                disabled: true
            }),
            email: new FormControl({
                value: this.currentUser.email,
                disabled: true
            }, [Validators.required, Validators.email]),
            password: new FormControl({
                value: '',
                disabled: false
            }, [Validators.minLength(8)]),
        })
    }

    send() {
        //Change Firebase Email
        if (this.currentUser.email !== this.form.get('email').value) {
            this.isLoading = true;
            console.log("changing email: ", this.form.get('email').value)
            let emailChange = this.afAuth.currentUser;
            emailChange.then(res => {
                return res.updateEmail(this.form.get('email').value)
            }).then(() => {
                this.isLoading = false;
            }).catch(err => {
                console.log(err);
            })
        }

        //Change Firebase Password
        if ((this.form.get('password').value !== '') && this.form.get('password').valid) {
            this.isLoading = true;
            console.log("changing password: ",  this.form.get('password').value);
            let passwordChange = this.afAuth.currentUser;
            passwordChange.then(res => {
                return res.updatePassword(this.form.get('password').value);
            }).then(() => {
                this.isLoading = false;
            }).catch(err => {
                console.log(err)
            })
        }



        //Change other things in backend
        this.currentUser.email = this.form.get('email').value;
        this.currentUser.lastName = this.form.get('lastName').value;
        this.currentUser.firstName = this.form.get('firstName').value;
        console.log(this.currentUser);

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
        this.form.controls[type].enable();
    }

    onDeactivateForm(type) {
        this.form.controls[type].disable();
    }

    ngOnDestroy() {
        // this.authService.user$.unsubscribe();
    }

}
