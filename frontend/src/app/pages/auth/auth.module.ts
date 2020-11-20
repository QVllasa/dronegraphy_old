import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthComponent} from "./auth.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RouterModule} from "@angular/router";
import {AuthRoutingModule} from "./auth-routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { HttpClientModule} from "@angular/common/http";




@NgModule({
  declarations: [AuthComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        FlexLayoutModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatCheckboxModule,
        RouterModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        HttpClientModule
    ],
    providers: [

    ]
})
export class AuthModule { }
