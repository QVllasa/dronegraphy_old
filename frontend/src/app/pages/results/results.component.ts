import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../@dg/services/user.service';
import {Video} from '../../../@dg/models/video.model';
import {FormControl, FormGroup} from '@angular/forms';
import {ISortOption, SortingService} from '../../../@dg/services/sorting.service';
import {VideoResponse, VideoService} from '../../../@dg/services/video.service';
import {SearchService} from '../../../@dg/services/search.service';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {BehaviorSubject, pipe} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {CategoryService} from '../../../@dg/services/category.service';


@Component({
    selector: 'dg-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {


    constructor(public userService: UserService,
                private categoryService: CategoryService,
                private searchService: SearchService,
                public videoService: VideoService,
                private route: ActivatedRoute,
                private sortingService: SortingService) {
        console.log('start result component');

        const queryParams = this.route.snapshot.queryParams['search'];
        if (!queryParams) {
            return;
        }
        console.log('current query params', queryParams);
        if (Array.isArray(queryParams)) {
            this.searchService.values$.next([...queryParams]);
        } else {
            this.searchService.values$.next([queryParams]);
        }

    }

    ngOnInit(): void {
        this.categoryService.getCategories()
            .pipe(
                switchMap(res => {
                    return routeParamsCheck;
                })
            ).subscribe();

        const routeParamsCheck = this.route.params
            .pipe(
                tap(params => {
                    console.log('check for values', params['value']);
                    if (!params['value']) {
                        return;
                    }
                    const list = [];
                    for (const value of params['value'].split('&')) {
                        const activeCategory = this.categoryService.categories$.value.find(i => i.value === value);
                        activeCategory.checked = true;
                        list.push(activeCategory);
                    }
                    console.log('initial route params:', list);
                    this.searchService.activeCategories$.next(list);
                }));
    }

    loadMore(){
        this.videoService.onLoadMore();
    }

}
