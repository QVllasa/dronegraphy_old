import {Component, OnInit} from '@angular/core';
import {Link} from '../../../@dg/models/link.interface';
import {UserService} from '../../../@dg/services/user.service';


@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    memberLinks: Link[] = [

        {
            label: 'Profil',
            route: './profile',
        },
        {
            label: 'Mein Konto',
            route: './credits',
        },
        {
            label: 'Letzte Käufe',
            route: './history',
        }
    ];

    creatorLinks: Link[] = [
        {
            label: 'Profil',
            route: './creator',
            routerLinkActiveOptions: {exact: true}
        },
        {
            label: 'Meine Aufnahmen',
            route: './footage'
        },
        {
            label: 'Einnahmen',
            route: './income',
            disabled: false
        },
    ];

    adminLinks: Link[] = [
        {
            label: 'Admin',
            route: './admin',
        }
    ];

    constructor(public userService: UserService) {
    }

    ngOnInit() {

    }

    get links() {
        let links: Link[];
        this.userService.user$.subscribe(user => {
            if (!user) {
                return;
            }
            if (!user.getRole()) {
                return;
            }
            if (user.getRole() === ('ROLE_MEMBER')) {
                links = this.memberLinks;
            } else if (user.getRole() === ('ROLE_CREATOR')) {
                links = this.creatorLinks;
            } else if (user.getRole() === ('ROLE_ADMIN')) {
                links = this.adminLinks;
            }
        });
        return links;
    }


}
