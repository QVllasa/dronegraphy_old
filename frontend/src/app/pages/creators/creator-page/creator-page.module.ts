import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CreatorPageComponent} from './creator-page.component';
import {PageLayoutModule} from '../../../../@dg/components/page-layout/page-layout.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ContainerModule} from '../../../../@dg/directives/container/container.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {VideoPlayerModule} from '../../../../@dg/components/video/video-player/video-player.module';
import {VideoGridModule} from '../../../../@dg/components/video/video-grid/video-grid.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [CreatorPageComponent],
    imports: [
        CommonModule,
        PageLayoutModule,
        FlexLayoutModule,
        ContainerModule,
        MatButtonModule,
        MatIconModule,
        VideoPlayerModule,
        VideoGridModule,
        MatProgressSpinnerModule
    ],
  exports: [CreatorPageComponent]
})
export class CreatorPageModule { }
