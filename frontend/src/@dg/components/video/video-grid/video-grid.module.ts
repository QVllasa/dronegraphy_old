import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoGridComponent} from "./video-grid.component";
import {VideoItemComponent} from "../video-item/video-item.component";
import {VideoPlayerComponent} from "../video-player/video-player.component";


@NgModule({
    imports: [
        CommonModule

    ],
    exports: [
        VideoGridComponent
    ],
    declarations: [VideoGridComponent, VideoItemComponent, VideoPlayerComponent]
})
export class VideoGridModule {
}
