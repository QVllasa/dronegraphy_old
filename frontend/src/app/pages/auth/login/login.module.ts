import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RouterModule} from "@angular/router";
import {LoginRoutingModule} from "./login-routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [LoginComponent],
    imports: [
        CommonModule,
        LoginRoutingModule,
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
export class LoginModule { }
