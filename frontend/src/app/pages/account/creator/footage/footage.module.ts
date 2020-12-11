import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FootageRoutingModule } from './footage-routing.module';
import { FootageComponent } from './footage.component';


@NgModule({
  declarations: [FootageComponent],
  imports: [
    CommonModule,
    FootageRoutingModule
  ]
})
export class FootageModule { }
