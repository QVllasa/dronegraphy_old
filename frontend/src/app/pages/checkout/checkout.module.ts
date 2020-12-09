import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {PageLayoutModule} from "../../../@dg/components/page-layout/page-layout.module";
import {VideoGridModule} from "../../../@dg/components/video/video-grid/video-grid.module";
import {ContainerModule} from "../../../@dg/directives/container/container.module";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    FlexLayoutModule,
    PageLayoutModule,
    VideoGridModule,
    ContainerModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule
  ]
})
export class CheckoutModule { }
