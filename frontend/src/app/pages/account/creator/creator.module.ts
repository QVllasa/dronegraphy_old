import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatorComponent } from './creator.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRippleModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [CreatorComponent],
  exports: [
    CreatorComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    FlexLayoutModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatRippleModule,
    MatButtonModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatInputModule,
    RouterModule
  ]
})
export class CreatorModule { }
