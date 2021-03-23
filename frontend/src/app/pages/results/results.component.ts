import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../@dg/services/user.service';
import {SortingService} from '../../../@dg/services/sorting.service';
import {VideoService} from '../../../@dg/services/video.service';
import {SearchService} from '../../../@dg/services/search.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap, take, tap} from 'rxjs/operators';
import {CategoryService} from '../../../@dg/services/category.service';
import {Subscription} from 'rxjs';


@Component({
    selector: 'dg-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {

    initVideos$: Subscription;

    constructor(public userService: UserService,
                private categoryService: CategoryService,
                private searchService: SearchService,
                public videoService: VideoService,
                private route: ActivatedRoute) {


        const queryParams = this.route.snapshot.queryParams['search'];
        if (!queryParams) {
            return;
        }

        if (Array.isArray(queryParams)) {
            this.searchService.search$.next([...queryParams]);
        } else {
            this.searchService.search$.next([queryParams]);
        }
    }

    ngOnInit(): void {
        this.initVideos$ = this.videoService.init().subscribe((res) => {
            this.videoService.isLoading$.next(false);
        });
        this.categoryService.getCategories()
            .pipe(
                switchMap(() => {
                    return this.route.params;
                })
            ).subscribe(params => {
            if (!params['category']) {
                return;
            }
            for (const value of params['category'].split('&')) {
                const index = this.categoryService.categories$.value.findIndex(i => i.value === value);
                this.categoryService.categories$.value[index].checked = true;
            }
            this.categoryService.categories$.next(this.categoryService.categories$.value);
        });
    }

    loadMore() {
        this.videoService.onLoadMore();
    }

    ngOnDestroy() {
        this.initVideos$.unsubscribe();
    }

}
