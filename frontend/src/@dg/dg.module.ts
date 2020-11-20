import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { TreeCheckboxesComponent } from './components/tree-checkboxes/tree-checkboxes.component';
import { CloseComponent } from './components/close/close.component';


@NgModule({
  imports: [
    CommonModule,
    LayoutModule
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
