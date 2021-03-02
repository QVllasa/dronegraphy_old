import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {map, tap} from 'rxjs/operators';
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

    options$ = new BehaviorSubject<ISortOption[]>([]);
    initialSort = 1;


    constructor(private http: HttpClient, private searchService: SearchService) {
    }

    getFilters() {
        return this.http.get<ISortOption[]>(environment.apiUrl + '/sorting')
            .pipe(
                map(options => {
                        this.options$.next(options);
                        const initialOption = options.find(x => x.key === this.initialSort);
                        this.searchService.activeSort$.next(initialOption);
                        return options;
                    }
                )
            );
    }


}
