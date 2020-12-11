import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {



    constructor(public authService: AuthenticationService) {
    }

    ngOnInit() {

    }


}
