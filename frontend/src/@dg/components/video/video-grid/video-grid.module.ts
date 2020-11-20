import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoGridComponent} from "./video-grid.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {VideoItemModule} from "../video-item/video-item.module";


@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        VideoItemModule

    ],
    exports: [
        VideoGridComponent
    ],
    declarations: [VideoGridComponent]
})
export class VideoGridModule {
}
