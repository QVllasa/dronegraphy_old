import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from './layout/layout.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {SecondsToMinutesModule} from "./pipes/seconds/seconds-to-minutes.module";


@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        SecondsToMinutesModule
    ],
    exports: [
        LayoutModule
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill'
            } as MatFormFieldDefaultOptions
        }
    ],
    declarations: []
})
export class dgModule {
}
