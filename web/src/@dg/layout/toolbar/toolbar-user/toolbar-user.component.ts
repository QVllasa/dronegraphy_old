import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import icPerson from '@iconify/icons-ic/twotone-person';
import {AuthenticationService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';

@Component({
    selector: 'dg-toolbar-user',
    templateUrl: './toolbar-user.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserComponent implements OnInit {

    dropdownOpen: boolean;
    icPerson = icPerson;


    constructor(public userService: UserService,
                public authService: AuthenticationService) {
    }

    ngOnInit() {
    }

}
