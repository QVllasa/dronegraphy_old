import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeCheckboxesComponent} from "./tree-checkboxes.component";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTreeModule} from "@angular/material/tree";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [TreeCheckboxesComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTreeModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [
    TreeCheckboxesComponent
  ]
})
export class TreeCheckboxesModule { }
