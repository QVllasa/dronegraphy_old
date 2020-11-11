import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {RegisterRoutingModule} from "./register-routing.module";
import {NgParticlesModule} from "ng-particles";
import {MatListModule} from "@angular/material/list";



@NgModule({
  declarations: [RegisterComponent],
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCheckboxModule,
        FlexLayoutModule,
        MatTooltipModule,
        MatButtonModule,
        MatInputModule,
        RouterModule,
        MatIconModule,
        NgParticlesModule,
        MatListModule
    ]
})
export class RegisterModule { }
