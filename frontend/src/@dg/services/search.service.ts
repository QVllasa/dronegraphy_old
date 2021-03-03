import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ICategory} from '../models/category.model';
import {removeDuplicateObjects} from '../utils/remove-duplicate-objects';
import {Location} from '@angular/common';
import {ISortOption} from './sorting.service';
import {tap} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class SearchService {


    // Store Search Values
    values$ = new BehaviorSubject<string[]>([]);


    // Store Active Categories
    activeCategories$ = new BehaviorSubject<ICategory[]>([]);

    // Store Sorting Filter
    activeSort$ = new BehaviorSubject<ISortOption>(null);


    constructor(private router: Router, private route: ActivatedRoute, private location: Location) {

    }


    onAddSearch(terms: string) {
        if (!terms) {
            return;
        }
        let additionalKeys = terms.split(' ');
        additionalKeys = additionalKeys.filter(e => String(e).trim());
        let values = this.values$.value;
        values.push(...additionalKeys);
        values = values.filter((item, i, ar) => ar.indexOf(item) === i);
        this.values$.next(values);
        this.updateRoute();
    }

    onRemoveSearch(key) {
        const val = this.values$.value;
        val.splice(val.indexOf(key), 1);
        this.values$.next(val);
        this.updateRoute();
    }


    onSelectCategory(category: ICategory) {
        console.log('values', this.activeCategories$.value);
        let categories: ICategory[];
        if (this.activeCategories$.value.length > 0) {
            categories = this.activeCategories$.value;
        } else {
            categories = [];
        }
        categories.push(category);
        categories = removeDuplicateObjects(categories);
        this.activeCategories$.next(categories);
        this.updateRoute();
    }

    onDeselectCategory(category: ICategory) {
        category.checked = false;
        const categories = this.activeCategories$.value;
        categories.splice(categories.indexOf(category), 1);
        this.activeCategories$.next(categories);
        this.updateRoute();
    }

    onSortChange(sort: ISortOption) {
        this.activeSort$.next(sort);
        this.updateRoute();
    }


    updateRoute() {
        const route = './results/';
        if (this.activeCategories$.value.length > 0 || this.values$.value.length > 0) {
            this.router.navigate([route, this.activeCategories$.value.map(a => a.value).join('&')], {
                relativeTo: this.route,
                queryParams: {search: this.values$.value, sort: this.activeSort$.value.key},
                queryParamsHandling: 'merge'
            });
        } else if (this.values$.value.length > 0) {
            this.router.navigate([route], {
                relativeTo: this.route,
                queryParams: {search: this.values$.value, sort: this.activeSort$.value.key},
                queryParamsHandling: 'merge'
            });
        } else {
            this.router.navigate([''], {
                relativeTo: this.route,
                queryParams: {search: this.values$.value, sort: this.activeSort$.value.key},
                queryParamsHandling: 'merge'
            });
        }

    }


}
