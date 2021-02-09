import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderModule} from './header/header.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HomeComponent} from './home.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {TreeCheckboxesModule} from '../../../@dg/components/tree-checkboxes/tree-checkboxes.module';
import {VideoGridModule} from '../../../@dg/components/video/video-grid/video-grid.module';
import {HomeRoutingModule} from './home-routing.module';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {VideoItemModule} from "../../../@dg/components/video/video-item/video-item.module";
import {VideoPlayerModule} from "../../../@dg/components/video/video-player/video-player.module";


@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        HeaderModule,
        FlexLayoutModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        HomeRoutingModule,
        MatChipsModule,
        MatSnackBarModule,
        TreeCheckboxesModule,
        VideoGridModule,
        VideoItemModule,
        VideoPlayerModule
    ],
    exports: []
})
export class HomeModule {
}
