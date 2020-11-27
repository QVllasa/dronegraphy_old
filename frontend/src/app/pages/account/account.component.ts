import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {IUser} from "../../../@dg/interfaces/user.interface";
import {tap} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
                public authService: AuthenticationService,
                private cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            if (!user){
                return
            }
            this.currentUser = user;
            this.initForm();
        })

    }

    initForm (){
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
        this.isLoading = true;
        this.currentUser.email = this.form.get('email').value;
        this.currentUser.lastName = this.form.get('lastName').value;
        this.currentUser.firstName = this.form.get('firstName').value;
        setTimeout(() => {
            console.log(this.form.get('password').value);
            this.isLoading = false;
        }, 2000)

        if ((this.form.get('password').value !== '') && this.form.get('password').valid){

            // let user = this.afAuth.currentUser;
            // user.then(res => {
            //     return res.updatePassword(this.form.get('password').value);
            // }).then(res => {
            //     console.log(res);
            //     this.isLoading = false;
            // })
            //     .catch(err => {
            //     console.log(err)
            // })
        }
        console.log(this.currentUser);

    }

    togglePassword() {
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

    onActivateForm(type) {
        // this.editMode = true;
        this.form.controls[type].enable();
    }

    onDectivateForm(type) {
        // this.editMode = false;
        this.form.controls[type].disable();
    }

    ngOnDestroy() {
        // this.authService.user$.unsubscribe();
    }

}
