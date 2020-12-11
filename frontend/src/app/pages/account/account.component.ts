import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Link} from "../../../@dg/models/link.interface";


@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    links: Link[] = [
        {
            label: 'Profil',
            route: './',
            routerLinkActiveOptions: { exact: true }
        },
        {
            label: 'Meine Aufnahmen',
            route: './footage'
        },
        {
            label: 'Einnahmen',
            route: './income',
            disabled: false
        }
    ];

    constructor(public userService: AuthenticationService) {
    }

    ngOnInit() {

    }


}
