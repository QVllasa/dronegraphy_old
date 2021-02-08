import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CreatorsRoutingModule} from './creators-routing.module';
import {IconModule} from '@visurel/iconify-angular';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {CreatorsComponent} from "./creators.component";


@NgModule({
  declarations: [CreatorsComponent],
  imports: [
    CommonModule,
    CreatorsRoutingModule,
    IconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ]
})
export class CreatorsModule {
}
