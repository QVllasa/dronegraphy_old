import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {particleConfig} from "../../../../particle";
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
    selector: 'vex-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    form: FormGroup;

    particlesOptions = particleConfig;

    inputType = 'password';
    visible = false;


    constructor(private router: Router,
                private fb: FormBuilder,
                private cd: ChangeDetectorRef,
                private auth: AngularFireAuth
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
        this.auth.createUserWithEmailAndPassword(this.form.get('email').value, this.form.get('password').value)
            .then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
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
