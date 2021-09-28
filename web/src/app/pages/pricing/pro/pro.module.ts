import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProRoutingModule } from './pro-routing.module';
import { ProComponent } from './pro.component';


@NgModule({
  declarations: [ProComponent],
  imports: [
    CommonModule,
    ProRoutingModule
  ]
})
export class ProModule { }
