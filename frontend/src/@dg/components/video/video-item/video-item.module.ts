import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoItemComponent} from "./video-item.component";
import {VideoPlayerComponent} from "../video-player/video-player.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {OnHoverModule} from "../../../directives/onHover.module";
import {VideoActionsComponent} from "../video-actions/video-actions.component";
import {VideoPlayerModule} from "../video-player/video-player.module";
import {RouterModule} from '@angular/router';


@NgModule({
    declarations: [VideoItemComponent, VideoActionsComponent],
    imports: [
        CommonModule,
        VideoPlayerModule,
        FlexLayoutModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        OnHoverModule,
        RouterModule
    ],
    exports: [VideoItemComponent, VideoActionsComponent]
})
export class VideoItemModule {
}
