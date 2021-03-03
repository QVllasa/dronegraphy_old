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

    videos$ = new BehaviorSubject<Video[]>([]);
    response: VideoResponse;

    batchSize = 50;
    endOfResults: boolean;
    isLoading: boolean;

    filterOptions: ISortOption[] = [];
    form: FormGroup;
    filterControl = new FormControl();
    selectedValue: string;

    constructor(public userService: UserService,
                private categoryService: CategoryService,
                private searchService: SearchService,
                private videoService: VideoService,
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

        this.loadVideos();
        this.videos$.subscribe(videos => {
            console.log(videos.length);
        });

    }

    onLoad() {
        const limit = this.batchSize;
        const page = this.response.page + 1;
        this.endOfResults = false;
        if (page === this.response.totalpages + 1) {
            this.endOfResults = true;
            return;
        }
        this.isLoading = true;
        setTimeout(() => {
            this.loadVideos(limit, page);
        }, 500);
    }

    async loadVideos(limit?: number, page?: number, category?: string[], search?: string[]) {
        const res = await this.videoService.getVideos(limit, page, category, search).toPromise();
        this.videos$.next([...this.videos$.value, ...this.videoService.mapVideos(res)]);
        this.response = res;
        console.log(res);
        this.isLoading = false;
    }

}
