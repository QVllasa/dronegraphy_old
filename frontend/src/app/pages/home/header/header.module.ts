import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SearchModule} from "../../../../@dg/components/search/search.module";


@NgModule({
    declarations: [HeaderComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatInputModule,
        FlexLayoutModule,
        MatButtonModule,
        RouterModule,
        FormsModule,
        SearchModule
    ],
    exports: [HeaderComponent]
})
export class HeaderModule {
}
