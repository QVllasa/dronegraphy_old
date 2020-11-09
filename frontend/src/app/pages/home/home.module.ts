import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from "./home.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import { StartComponent } from './start/start.component';
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {AppModule} from "../../app.module";
import {VideoGridComponent} from "../components/video-grid/video-grid.component";
import {MatChipsModule} from "@angular/material/chips";
import {VideoPlayerComponent} from "../../../@vex/components/video/video-player/video-player.component";
import {VideoItemComponent} from "../../../@vex/components/video/video-item/video-item.component";
import {TreeCheckboxesModule} from "../../../@vex/components/tree-checkboxes/tree-checkboxes.module";





@NgModule({
    declarations: [HomeComponent, StartComponent, VideoGridComponent, VideoItemComponent, VideoPlayerComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        RouterModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        AppModule,
        MatChipsModule,
        TreeCheckboxesModule
    ],
  exports: [HomeComponent]
})
export class HomeModule { }
