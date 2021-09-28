import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PricingComponent} from './pricing.component';
import {ProComponent} from './pro/pro.component';
import {CreatorComponent} from './creator/creator.component';
import {JuniorComponent} from './junior/junior.component';


const routes: Routes = [
    {
        path: '',
        component: PricingComponent
    },
    {
        path: 'pro',
        component: ProComponent
    },
    {
        path: 'creator',
        component: CreatorComponent
    },
    {
        path: 'junior',
        component: JuniorComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PricingRoutingModule {
}
