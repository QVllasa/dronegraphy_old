import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ICategory} from '../models/category.model';
import {removeDuplicateObjects} from '../utils/remove-duplicate-objects';
import {Location} from '@angular/common';
import {ISortOption} from './sorting.service';
import {tap} from 'rxjs/operators';
import {CategoryService} from './category.service';


@Injectable({
    providedIn: 'root'
})
export class SearchService {


    // Store Search Values
    search$ = new BehaviorSubject<string[]>([]);

    // Store Sorting Filter
    activeSort$ = new BehaviorSubject<ISortOption>(null);


    constructor(private router: Router, private route: ActivatedRoute, private categoryService: CategoryService) {
    }


    onAddSearch(terms: string) {
        if (!terms) {
            return;
        }
        let additionalKeys = terms.split(' ');
        additionalKeys = additionalKeys.filter(e => String(e).trim());
        let values = this.search$.value;
        values.push(...additionalKeys);
        values = values.filter((item, i, ar) => ar.indexOf(item) === i);
        this.search$.next(values);
        this.updateRoute();
    }

    onRemoveSearch(key) {
        const val = this.search$.value;
        val.splice(val.indexOf(key), 1);
        this.search$.next(val);
        this.updateRoute();
    }


    onToggleCategory(category: ICategory) {
        const index = this.categoryService.categories$.value.findIndex(i => i.id === category.id);
        this.categoryService.categories$.value[index].checked = !this.categoryService.categories$.value[index].checked;
        this.categoryService.categories$.next(this.categoryService.categories$.value);
        this.updateRoute();
    }


    onSortChange(sort: ISortOption) {
        this.activeSort$.next(sort);
        this.updateRoute();
    }


    updateRoute() {
        const route = './results/';
        if (!this.categoryService.categories$.value) {
            return;
        }
        const categories = this.categoryService.categories$.value.filter((i => i.checked === true));
        console.log(categories);
        this.router.navigate([route, categories.map(a => a.value).join('&')], {
            relativeTo: this.route,
            queryParams: {search: this.search$.value, sort: this.activeSort$.value.key},
            queryParamsHandling: 'merge'
        });

    }


}
