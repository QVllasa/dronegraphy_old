import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScrollbarModule } from '../../components/scrollbar/scrollbar.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';


@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    ScrollbarModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    IconModule
  ],
  exports: [SidenavComponent]
})
export class SidenavModule {
}
