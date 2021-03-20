import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResponsiveColsDirective} from './responsive-cols.directive';



@NgModule({
  declarations: [ResponsiveColsDirective],
  imports: [
    CommonModule
  ],
  exports: [ResponsiveColsDirective]
})
export class ResponsiveColsModule { }
