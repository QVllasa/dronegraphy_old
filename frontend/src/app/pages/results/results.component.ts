import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../@dg/services/user.service";
import {Video} from "../../../@dg/models/video.model";
import {FormControl, FormGroup} from "@angular/forms";
import {ISortOption, SortingService} from "../../../@dg/services/sorting.service";
import {ParentCategory} from "../../../@dg/components/tree-checkboxes/tree-checkboxes.component";
import {VideoService} from "../../../@dg/services/video.service";
import {SearchService} from "../../../@dg/services/search.service";

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
                private searchService: SearchService,
                private videoService: VideoService,
                private sortingService: SortingService) {
    }

    ngOnInit(): void {


        this.videoService.getVideos(27, 0).subscribe(videos => {
            // console.log(videos)
            this.videos = videos;

        });

    }

    selectedCategory(event: ParentCategory[]) {
       this.searchService.onSelectCategory(event)
    }

}
