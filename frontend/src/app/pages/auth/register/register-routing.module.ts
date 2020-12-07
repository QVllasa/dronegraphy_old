import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register.component';
import {AnonymousGuard} from '../../../../@dg/guards/anonymous.guard';


const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    canLoad: [AnonymousGuard],
    canActivate: [AnonymousGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule {
}
