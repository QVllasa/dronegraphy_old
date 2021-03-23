import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatorRoutingModule } from './creator-routing.module';
import { CreatorComponent } from './creator.component';


@NgModule({
  declarations: [CreatorComponent],
  imports: [
    CommonModule,
    CreatorRoutingModule
  ]
})
export class CreatorModule { }
