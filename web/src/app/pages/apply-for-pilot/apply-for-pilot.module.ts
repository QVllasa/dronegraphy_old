import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplyForPilotRoutingModule } from './apply-for-pilot-routing.module';
import { ApplyForPilotComponent } from './apply-for-pilot.component';


@NgModule({
  declarations: [ApplyForPilotComponent],
  imports: [
    CommonModule,
    ApplyForPilotRoutingModule
  ]
})
export class ApplyForPilotModule { }
