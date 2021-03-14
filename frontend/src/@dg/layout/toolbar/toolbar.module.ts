import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolbarComponent} from './toolbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import {ToolbarUserModule} from './toolbar-user/toolbar-user.module';
import {ToolbarSearchModule} from './toolbar-search/toolbar-search.module';
import {IconModule} from '@visurel/iconify-angular';
import {RouterModule} from '@angular/router';
import {NavigationItemModule} from '../../components/navigation-item/navigation-item.module';
import {MegaMenuModule} from '../../components/mega-menu/mega-menu.module';
import {ContainerModule} from '../../directives/container/container.module';
import {MatBadgeModule} from '@angular/material/badge';


@NgModule({
    declarations: [ToolbarComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatRippleModule,
        ToolbarUserModule,
        ToolbarSearchModule,
        IconModule,
        RouterModule,
        NavigationItemModule,
        MegaMenuModule,
        ContainerModule,
        MatBadgeModule
    ],
    exports: [ToolbarComponent]
})
export class ToolbarModule {
}
