import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountRoutingModule} from './account-routing.module';
import {PageLayoutModule} from "../../../@dg/components/page-layout/page-layout.module";
import {ContainerModule} from "../../../@dg/directives/container/container.module";
import {AccountComponent} from "./account.component";
import {MatTabsModule} from "@angular/material/tabs";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDividerModule} from "@angular/material/divider";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
    declarations: [AccountComponent],
    imports: [
        CommonModule,
        PageLayoutModule,
        ContainerModule,
        AccountRoutingModule,
        MatTabsModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        MatDividerModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ]
})
export class AccountModule {
}
