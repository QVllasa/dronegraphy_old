import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ICategory} from '../models/category.model';
import {map, tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {removeDuplicateObjects} from '../utils/remove-duplicate-objects';


@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    categories$ = new BehaviorSubject<ICategory[]>([]);

    constructor(private http: HttpClient) {
        this.getCategories().subscribe();
    }

    getCategories() {
        return this.http.get<ICategory[]>(environment.apiUrl + '/categories')
            .pipe(
                map(res => {
                    // Sort by Parent and Child
                    const list: ICategory[] = [];
                    for (const i of res) {
                        if (i.parent_key === 0) {
                            i.level = 0;
                            i.expandable = true;
                            list.push(i);
                            for (const j of res) {
                                if (i.key === j.parent_key) {
                                    j.level = 1;
                                    j.expandable = false;
                                    list.push(j);
                                }
                            }
                        }
                    }
                    this.categories$.next(list);
                    return list;
                })
            );
    }




}
