import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {IUser, User} from "../../../@dg/models/user.model";
import {tap} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";
import {MatSnackBar} from "@angular/material/snack-bar";
import set = Reflect.set;
import {UserService} from "../../../@dg/services/user.service";

@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
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

    changeUserInfo(){
        //Change other things in backend
        this.currentUser.email = this.form.get('email').value;
        this.currentUser.lastName = this.form.get('lastName').value;
        this.currentUser.firstName = this.form.get('firstName').value;

        // return this.userService.updateUser(this.currentUser)

        return this.currentUser;
    }

    changeUserEmail() {
        //Change Firebase Email
        if (this.currentUser.email !== this.form.get('email').value) {
            console.log("changing email: ", this.form.get('email').value)
            this.afAuth.currentUser.then(res => {
                return res.updateEmail(this.form.get('email').value)
            })
        }
    }

    changePassword() {
        //Change Firebase Password
        if ((this.form.get('password').value !== '') && this.form.get('password').valid) {
            console.log("changing password: ", this.form.get('password').value);
            return this.afAuth.currentUser.then(res => {
                return res.updatePassword(this.form.get('password').value);
            })
        }
    }

    send() {
        this.isLoading = true;

        //Disable every field before sending
        Object.entries(this.form.controls).forEach(
            ([key, value]) => {
                value.disable();
            }
        )

        Promise.all([
            this.changePassword(),
            this.changeUserEmail(),
            this.changeUserInfo()
        ]).then((res)=>{
            console.log(res)
            this.isLoading = false;
        })


        // setTimeout(() => {
        //     this.isLoading = false;
        // }, 3000)
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
        // this.isLoading[type] = true;
        this.form.controls[type].disable();
        // setTimeout(()=>{
        //     this.isLoading[type] = false;
        // }, 5000)


    }

    ngOnDestroy() {
        // this.authService.user$.unsubscribe();
    }

}
