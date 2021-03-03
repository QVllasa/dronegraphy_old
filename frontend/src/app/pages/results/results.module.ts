import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ContainerModule} from '../../../@dg/directives/container/container.module';
import {PageLayoutModule} from '../../../@dg/components/page-layout/page-layout.module';
import {ResultsComponent} from './results.component';
import {ResultsRoutingModule} from './results-routing.module';
import {TreeCheckboxesModule} from '../../../@dg/components/tree-checkboxes/tree-checkboxes.module';
import {VideoGridModule} from '../../../@dg/components/video/video-grid/video-grid.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {SortBarModule} from '../../../@dg/components/sort-bar/sort-bar.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [ResultsComponent],
    imports: [
        CommonModule,
        ResultsRoutingModule,
        FlexLayoutModule,
        MatIconModule,
        MatButtonModule,
        ContainerModule,
        PageLayoutModule,
        TreeCheckboxesModule,
        VideoGridModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        SortBarModule,
        InfiniteScrollModule,
        MatProgressSpinnerModule
    ]
})
export class ResultsModule { }
