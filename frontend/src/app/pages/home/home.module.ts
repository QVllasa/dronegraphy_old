import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from "./home.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {AppModule} from "../../app.module";
import {MatChipsModule} from "@angular/material/chips";
import {TreeCheckboxesModule} from "../../../@dg/components/tree-checkboxes/tree-checkboxes.module";
import {VideoGridModule} from "../../../@dg/components/video/video-grid/video-grid.module";
import {HeaderComponent} from "./header/header.component";





@NgModule({
    declarations: [HomeComponent, HeaderComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        RouterModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        AppModule,
        MatChipsModule,
        TreeCheckboxesModule,
        VideoGridModule
    ],
  exports: [HomeComponent]
})
export class HomeModule { }
