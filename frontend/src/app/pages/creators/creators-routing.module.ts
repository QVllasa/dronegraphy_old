import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreatorsComponent} from './creators.component';
import {CreatorPageComponent} from './creator-page/creator-page.component';


const routes: Routes = [
    {
        path: '',
        component: CreatorsComponent
    },
    {
        path: ':key',
        component: CreatorPageComponent,
        children: [
            {
                path: ':name',
                component: CreatorPageComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreatorsRoutingModule {
}
