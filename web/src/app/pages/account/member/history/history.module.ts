import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDividerModule} from "@angular/material/divider";
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
  declarations: [HistoryComponent],
    imports: [
        CommonModule,
        HistoryRoutingModule,
        FlexLayoutModule,
        MatExpansionModule,
        MatDividerModule,
        MatPaginatorModule
    ]
})
export class HistoryModule { }
