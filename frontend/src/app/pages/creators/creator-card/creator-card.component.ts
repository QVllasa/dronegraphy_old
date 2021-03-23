import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../@dg/models/user.model';
import {hyphenateUrlParams} from '../../../../@dg/utils/hyphenate-url-params';
import {Router} from '@angular/router';

@Component({
    selector: 'dg-creator-card',
    templateUrl: './creator-card.component.html',
    styleUrls: ['./creator-card.component.scss']
})
export class CreatorCardComponent implements OnInit {

    @Input() creator: User;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    onLoadCreator(creator: User) {
        this.router.navigate(['/creators', creator.key, hyphenateUrlParams(creator.getFullName())]).then();
    }

}
