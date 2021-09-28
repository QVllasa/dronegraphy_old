import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeRoutingModule } from './income-routing.module';
import { IncomeComponent } from './income.component';
import {FlexLayoutModule} from "@angular/flex-layout";


@NgModule({
  declarations: [IncomeComponent],
    imports: [
        CommonModule,
        IncomeRoutingModule,
        FlexLayoutModule
    ]
})
export class IncomeModule { }
