import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SortBarComponent} from "./sort-bar.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [SortBarComponent],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatChipsModule,
        MatIconModule
    ],
  exports: [SortBarComponent]
})
export class SortBarModule { }
