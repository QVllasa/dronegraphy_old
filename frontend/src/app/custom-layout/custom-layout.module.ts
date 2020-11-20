import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../@dg/layout/layout.module';
import { CustomLayoutComponent } from './custom-layout.component';
import { SidenavModule } from '../../@dg/layout/sidenav/sidenav.module';
import { ToolbarModule } from '../../@dg/layout/toolbar/toolbar.module';
import { FooterModule } from '../../@dg/layout/footer/footer.module';
import { ConfigPanelModule } from '../../@dg/components/config-panel/config-panel.module';
import { SidebarModule } from '../../@dg/components/sidebar/sidebar.module';
import { QuickpanelModule } from '../../@dg/layout/quickpanel/quickpanel.module';
import {TreeCheckboxesModule} from "../../@dg/components/tree-checkboxes/tree-checkboxes.module";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";


@NgModule({
  declarations: [CustomLayoutComponent],
    imports: [
        CommonModule,
        LayoutModule,
        SidenavModule,
        ToolbarModule,
        FooterModule,
        ConfigPanelModule,
        SidebarModule,
        QuickpanelModule,
        MatIconModule,
        MatButtonModule,
        FlexLayoutModule

    ]
})
export class CustomLayoutModule {
}
