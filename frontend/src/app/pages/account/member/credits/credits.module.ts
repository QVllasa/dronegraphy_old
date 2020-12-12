import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditsRoutingModule } from './credits-routing.module';
import { CreditsComponent } from './credits.component';
import {WidgetQuickValueCenterModule} from "../../../../../@dg/components/widgets/widget-quick-value-center/widget-quick-value-center.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [CreditsComponent],
    imports: [
        CommonModule,
        CreditsRoutingModule,
        WidgetQuickValueCenterModule,
        FlexLayoutModule,
        MatButtonModule
    ]
})
export class CreditsModule { }
