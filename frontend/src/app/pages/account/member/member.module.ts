import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberComponent } from './member.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {WidgetQuickValueCenterModule} from "../../../../@dg/components/widgets/widget-quick-value-center/widget-quick-value-center.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDividerModule} from "@angular/material/divider";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSnackBarModule} from "@angular/material/snack-bar";



@NgModule({
    declarations: [MemberComponent],
    exports: [
        MemberComponent
    ],
    imports: [
        CommonModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        WidgetQuickValueCenterModule,
        MatExpansionModule,
        MatDividerModule,
        MatSnackBarModule,
        MatPaginatorModule
    ]
})
export class MemberModule { }
