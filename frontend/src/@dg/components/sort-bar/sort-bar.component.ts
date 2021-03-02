import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ISortOption, SortingService} from '../../services/sorting.service';
import {SearchService} from '../../services/search.service';
import {ICategory} from '../../models/category.model';
import {MatSelectChange} from '@angular/material/select';
import {map, switchMap, take} from 'rxjs/operators';

@Component({
    selector: 'dg-sort-bar',
    templateUrl: './sort-bar.component.html',
    styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent implements OnInit {
    sortOptions: ISortOption[] = [];
    form: FormGroup;
    sortControl = new FormControl();



    constructor(public sortingService: SortingService,
                public searchService: SearchService) {


    }

    ngOnInit(): void {
        this.sortingService.getFilters()
            .pipe(
                switchMap(options => {
                    this.sortOptions = options;
                    this.form = new FormGroup({
                        filter: this.sortControl
                    });
                    return this.searchService.activeSort$;
                }),
            ).subscribe();

        this.searchService.activeSort$.subscribe(value => {
            if (value) {
                this.sortControl.patchValue(value);
            }
        });
    }

    removeCategory(category: ICategory) {
        this.searchService.onDeselectCategory(category);
    }

    removeTerm(term: string) {
        this.searchService.onRemoveSearch(term);
    }

    onSort(value: ISortOption) {
        console.log(value.value);
        this.searchService.onSortChange(value);
    }

    isArray(list) {
        return Array.isArray(list);
    }

}
