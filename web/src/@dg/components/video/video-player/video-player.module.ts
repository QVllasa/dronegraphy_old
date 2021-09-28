import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {OnHoverModule} from "../../../directives/onHover.module";
import {VideoPlayerComponent} from "./video-player.component";


@NgModule({
  declarations: [ VideoPlayerComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    OnHoverModule
  ],
    exports: [VideoPlayerComponent]
})
export class VideoPlayerModule { }
