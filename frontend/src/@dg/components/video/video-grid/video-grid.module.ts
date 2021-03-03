import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoGridComponent} from "./video-grid.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {VideoItemModule} from "../video-item/video-item.module";
import {InfiniteScrollModule} from 'ngx-infinite-scroll';


@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        VideoItemModule,
        InfiniteScrollModule

    ],
    exports: [
        VideoGridComponent
    ],
    declarations: [VideoGridComponent]
})
export class VideoGridModule {
}
