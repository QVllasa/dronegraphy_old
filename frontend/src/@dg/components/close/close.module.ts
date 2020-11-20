import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CloseComponent} from "./close.component";



@NgModule({
  declarations: [CloseComponent],
  imports: [
    CommonModule
  ],
  exports: [CloseComponent]
})
export class CloseModule { }
