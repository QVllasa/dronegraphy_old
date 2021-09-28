import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {map, take, tap} from 'rxjs/operators';
import {SearchService} from './search.service';

export interface ISortOption {
    id: string;
    value: string;
    key: number;

}

@Injectable({
    providedIn: 'root'
})
export class SortingService {

    constructor(private http: HttpClient) {

    }

    getSortOptions() {
        return this.http.get<ISortOption[]>(environment.apiUrl + '/sorting');
    }


}
