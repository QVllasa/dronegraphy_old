import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import {CategoryService} from '../../services/category.service';
import {SearchService} from '../../services/search.service';
import {ICategory} from '../../models/category.model';
import {ActivatedRoute} from '@angular/router';
import {mergeMap, switchMap, tap} from 'rxjs/operators';
import {ArrayDataSource} from '@angular/cdk/collections';
import {removeDuplicateObjects} from '../../utils/remove-duplicate-objects';


@Component({
    selector: 'dg-tree-checkboxes',
    templateUrl: 'tree-checkboxes.component.html',
    styleUrls: ['tree-checkboxes.component.scss'],
})
export class TreeCheckboxesComponent {

    treeControl = new FlatTreeControl<ICategory>(
        node => node.level, node => node.expandable);

    dataSource: ArrayDataSource<ICategory>;

    data: ICategory[] = [];

    isLoading: boolean;


    constructor(public searchService: SearchService,
                private route: ActivatedRoute,
                public categoryService: CategoryService) {
        this.isLoading = true;
        this.categoryService.categories$.subscribe(data => {
            this.isLoading = false;
            this.dataSource = new ArrayDataSource<ICategory>(data);
            this.data = data;
        });

        // this.searchService.activeCategories$.subscribe(data => {
        //     if (this.data.length === 0) {
        //         return;
        //     }
        //     // this.dataSource = new ArrayDataSource<ICategory>(this.data);
        // });

    }

    hasChild = (_: number, node: ICategory) => node.expandable;


    getParentNode(node: ICategory) {
        const nodeIndex = this.data.indexOf(node);

        for (let i = nodeIndex - 1; i >= 0; i--) {
            if (this.data[i].level === node.level - 1) {
                return this.data[i];
            }
        }

        return null;
    }

    shouldRender(node: ICategory) {
        let parent = this.getParentNode(node);
        while (parent) {
            if (!parent.isExpanded) {
                return false;
            }
            parent = this.getParentNode(parent);
        }
        return true;
    }

    clickedActive(element) {
        if (this.searchService.activeCategories$.value.includes(element)) {
            this.searchService.onDeselectCategory(element);
        } else {
            this.searchService.onSelectCategory(element);
        }
    }
}


