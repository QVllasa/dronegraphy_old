import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountComponent} from "./account.component";
import {FlexLayoutModule} from "@angular/flex-layout";



@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  exports: [AccountComponent]
})
export class AccountModule { }
