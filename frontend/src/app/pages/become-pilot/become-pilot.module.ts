import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BecomePilotRoutingModule } from './become-pilot-routing.module';
import { BecomePilotComponent } from './become-pilot.component';


@NgModule({
  declarations: [BecomePilotComponent],
  imports: [
    CommonModule,
    BecomePilotRoutingModule
  ]
})
export class BecomePilotModule { }
