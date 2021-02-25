import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ISortOption, SortingService} from "../../services/sorting.service";

@Component({
    selector: 'dg-sort-bar',
    templateUrl: './sort-bar.component.html',
    styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent implements OnInit {
    sortOptions: ISortOption[] = [];
    form: FormGroup;
    filterControl = new FormControl();
    selectedValue: string;

    constructor(public sortingService: SortingService) {
    }

    ngOnInit(): void {
        this.sortingService.getFilters().subscribe(filters => {
            this.sortOptions = filters
            this.filterControl.patchValue(this.sortOptions[0].value)
            this.form = new FormGroup({
                filter: this.filterControl
            });
        })

    }

}
