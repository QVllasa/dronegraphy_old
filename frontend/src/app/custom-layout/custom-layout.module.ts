import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from '../../@dg/layout/layout.module';
import {CustomLayoutComponent} from './custom-layout.component';
import {SidenavModule} from '../../@dg/layout/sidenav/sidenav.module';
import {ToolbarModule} from '../../@dg/layout/toolbar/toolbar.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
    declarations: [CustomLayoutComponent],
    imports: [
        CommonModule,
        LayoutModule,
        SidenavModule,
        MatSnackBarModule,
        ToolbarModule,
        MatIconModule,
        MatButtonModule,
        FlexLayoutModule
    ]
})
export class CustomLayoutModule {
}
