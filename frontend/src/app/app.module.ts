import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import {ToolbarModule} from "../@vex/layout/toolbar/toolbar.module";
import {GridModule} from "@angular/flex-layout";
import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";





@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        VexModule,
        CustomLayoutModule,
        AngularFireModule.initializeApp(environment.firebase),
        ToolbarModule,
        GridModule
    ],
    providers: [],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
