import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../@dg/services/user.service';
import {Video} from '../../../@dg/models/video.model';
import {FormControl, FormGroup} from '@angular/forms';
import {ISortOption, SortingService} from '../../../@dg/services/sorting.service';
import {VideoService} from '../../../@dg/services/video.service';
import {SearchService} from '../../../@dg/services/search.service';
import {ICategory} from '../../../@dg/models/category.model';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {pipe} from 'rxjs';
import {switchMap, take, tap} from 'rxjs/operators';
import {CategoryService} from '../../../@dg/services/category.service';


@Component({
    selector: 'dg-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

    videos: Video[];

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





        this.videoService.getVideos(27, 0).subscribe(videos => {
            // console.log(videos)
            this.videos = videos;

        });

    }
}
