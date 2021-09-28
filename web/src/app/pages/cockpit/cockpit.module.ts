import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CockpitRoutingModule } from './cockpit-routing.module';
import { CockpitComponent } from './cockpit.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {PageLayoutModule} from "../../../@dg/components/page-layout/page-layout.module";
import {MatTabsModule} from "@angular/material/tabs";
import {ContainerModule} from "../../../@dg/directives/container/container.module";
import {VideoGridModule} from "../../../@dg/components/video/video-grid/video-grid.module";


@NgModule({
  declarations: [CockpitComponent],
    imports: [
        CommonModule,
        CockpitRoutingModule,
        FlexLayoutModule,
        PageLayoutModule,
        MatTabsModule,
        ContainerModule,
        VideoGridModule
    ]
})
export class CockpitModule { }
