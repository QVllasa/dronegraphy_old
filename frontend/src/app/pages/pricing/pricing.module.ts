import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PricingRoutingModule} from './pricing-routing.module';
import {PricingComponent} from './pricing.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ContainerModule} from '../../../@dg/directives/container/container.module';
import {PageLayoutModule} from '../../../@dg/components/page-layout/page-layout.module';


@NgModule({
    declarations: [PricingComponent],
    imports: [
        CommonModule,
        PricingRoutingModule,
        FlexLayoutModule,
        MatIconModule,
        MatButtonModule,
        ContainerModule,
        PageLayoutModule
    ]
})
export class PricingModule {
}
