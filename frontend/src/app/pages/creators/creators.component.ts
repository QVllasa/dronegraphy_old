import {Component, OnInit} from '@angular/core';
import {IUser, User} from '../../../@dg/models/user.model';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../@dg/services/user.service';
import {map} from 'rxjs/operators';

@Component({
    selector: 'dg-creators',
    templateUrl: './creators.component.html',
    styleUrls: ['./creators.component.scss']
})
export class CreatorsComponent implements OnInit {

    creators: User[];

    constructor(private http: HttpClient, private userService: UserService) {
    }

    ngOnInit(): void {
        this.http.get<IUser[]>(environment.apiUrl + '/creators')
            .pipe(
                map(res => {
                    this.creators = [];
                    for (const creator of res) {
                        this.creators.push(new User().deserialize(creator));
                    }
                }))
            .subscribe(res => {
                console.log(this.creators);
            });
    }

}
