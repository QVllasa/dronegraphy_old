import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuniorRoutingModule } from './junior-routing.module';
import { JuniorComponent } from './junior.component';


@NgModule({
  declarations: [JuniorComponent],
  imports: [
    CommonModule,
    JuniorRoutingModule
  ]
})
export class JuniorModule { }
