import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CockpitComponent} from './cockpit.component';
import {AuthGuard} from '../../../@dg/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: CockpitComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CockpitRoutingModule {
}
