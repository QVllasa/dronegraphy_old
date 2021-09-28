import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../../@dg/services/user.service';

@Component({
    selector: 'dg-credits',
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

    user$ = this.userService.user$;

    constructor(public userService: UserService) {
    }

    ngOnInit(): void {
    }

}
