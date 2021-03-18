import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CreatorsRoutingModule} from './creators-routing.module';
import {IconModule} from '@visurel/iconify-angular';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {CreatorsComponent} from './creators.component';
import {PageLayoutModule} from '../../../@dg/components/page-layout/page-layout.module';
import {ContainerModule} from '../../../@dg/directives/container/container.module';
import {MatRippleModule} from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {VideoItemModule} from '../../../@dg/components/video/video-item/video-item.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CreatorPageModule} from './creator-page/creator-page.module';



@NgModule({
    declarations: [CreatorsComponent],
    imports: [
        CommonModule,
        CreatorsRoutingModule,
        IconModule,
        FlexLayoutModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        PageLayoutModule,
        ContainerModule,
        MatRippleModule,
        MatGridListModule,
        VideoItemModule,
        MatProgressSpinnerModule,
        CreatorPageModule
    ],
    exports: [CreatorsComponent]
})
export class CreatorsModule {
}
