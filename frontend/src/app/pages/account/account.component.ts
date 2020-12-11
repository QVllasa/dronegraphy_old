import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    form: FormGroup;

    constructor(public authService: AuthenticationService) {
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.form = new FormGroup({
            info: new FormGroup({
                firstName: new FormControl({
                    value: '',
                    disabled: true
                }, [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-Z ]*')]),
                lastName: new FormControl({
                    value: '',
                    disabled: true
                }),
                email: new FormControl({
                    value: '',
                    disabled: true
                }, [Validators.required, Validators.email]),
                slogan: new FormControl({
                    value: '',
                    disabled: true,
                })
            }),
            password: new FormControl({
                value: '',
                disabled: false
            }, [Validators.minLength(8)]),
        })
    }
}
