import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FootageRoutingModule } from './footage-routing.module';
import { FootageComponent } from './footage.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import {VideoCreateUpdateModule} from "./video-create-update/video-create-update.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SecondsToMinutesModule} from "../../../../../@dg/pipes/seconds/seconds-to-minutes.module";


@NgModule({
  declarations: [FootageComponent],
    imports: [
        CommonModule,
        FootageRoutingModule,
        MatMenuModule,
        MatSnackBarModule,
        MatCheckboxModule,
        FlexLayoutModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatPaginatorModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        VideoCreateUpdateModule,
        MatSlideToggleModule,
        SecondsToMinutesModule
    ]
})
export class FootageModule { }
