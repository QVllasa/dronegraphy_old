import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {IconModule} from '@visurel/iconify-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [SearchComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        IconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule
    ],
  exports: [SearchComponent]
})
export class SearchModule {
}
