import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ContainerModule} from '../../../@dg/directives/container/container.module';
import {PageLayoutModule} from '../../../@dg/components/page-layout/page-layout.module';
import { FootageRoutingModule } from './footage-routing.module';
import {FootageComponent} from './footage.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {VideoItemModule} from '../../../@dg/components/video/video-item/video-item.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {SecondsToMinutesModule} from '../../../@dg/pipes/seconds/seconds-to-minutes.module';


@NgModule({
  declarations: [FootageComponent],
  imports: [
    CommonModule,
    FootageRoutingModule,
    PageLayoutModule,
    ContainerModule,
    FlexLayoutModule,
    VideoItemModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    SecondsToMinutesModule,
  ]
})
export class FootageModule { }
