import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error500Component} from './error-500.component';



const routes: Routes = [
  {
    path: '',
    component: Error500Component,
    data: {
      containerEnabled: true,
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Error500RoutingModule {
}
