import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolbarSearchComponent} from './toolbar-search.component';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {IconModule} from '@visurel/iconify-angular';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [ToolbarSearchComponent],
    imports: [
        CommonModule,
        MatInputModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        IconModule,
        FormsModule
    ],
  exports: [ToolbarSearchComponent]
})
export class ToolbarSearchModule {
}
