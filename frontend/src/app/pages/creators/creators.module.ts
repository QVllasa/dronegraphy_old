import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CreatorsRoutingModule} from './creators-routing.module';
import {IconModule} from '@visurel/iconify-angular';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {CreatorsComponent} from './creators.component';
import {PageLayoutModule} from '../../../@dg/components/page-layout/page-layout.module';
import {ContainerModule} from '../../../@dg/directives/container/container.module';
import {MatRippleModule} from '@angular/material/core';


@NgModule({
    declarations: [CreatorsComponent],
    imports: [
        CommonModule,
        CreatorsRoutingModule,
        IconModule,
        FlexLayoutModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        PageLayoutModule,
        ContainerModule,
        MatRippleModule
    ]
})
export class CreatorsModule {
}
