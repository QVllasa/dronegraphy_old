import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ISortOption, SortingService} from '../../services/sorting.service';
import {SearchService} from '../../services/search.service';
import {ICategory} from '../../models/category.model';
import {switchMap, take, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {pipe} from 'rxjs';
import {CategoryService} from '../../services/category.service';


@Component({
    selector: 'dg-sort-bar',
    templateUrl: './sort-bar.component.html',
    styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent implements OnInit {


    form: FormGroup;
    sortControl = new FormControl();
    sortOptions: ISortOption[] = [];


    /**
     *  Initial Value for Sorting on Start Page
     *  Sorts for "Besondere Auswahl"
     */
    initialKey = 1;


    constructor(public sortingService: SortingService,
                private route: ActivatedRoute,
                public categoryService: CategoryService,
                public searchService: SearchService) {
        this.sortingService.getSortOptions()
            .pipe(
                switchMap(options => {
                    this.sortOptions = options;
                    this.form = new FormGroup({
                        filter: this.sortControl
                    });
                    return this.route.queryParams.pipe(take(1));
                })
            )
            .subscribe(param => {
                const sortKey = +param['sort'];
                if (!sortKey) {
                    const initialSortOption = this.sortOptions.find(x => x.key === this.initialKey);
                    this.searchService.activeSort$.next(initialSortOption);
                } else {
                    const initialSortOption = this.sortOptions.find(x => x.key === sortKey);
                    this.searchService.activeSort$.next(initialSortOption);
                }
            });


        this.searchService.activeSort$.subscribe(value => {
            if (value) {
                this.sortControl.patchValue(value);
            }
        });
    }

    ngOnInit(): void {

    }

    removeCategory(category: ICategory) {
        this.searchService.onToggleCategory(category);
    }

    removeTerm(term: string) {
        this.searchService.onRemoveSearch(term);
    }

    onSort(value: ISortOption) {
        this.searchService.onSortChange(value);
    }

    isArray(list) {
        return Array.isArray(list);
    }

}
