import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForgotPasswordComponent} from './forgot-password.component';
import {AnonymousGuard} from '../../../../@dg/guards/anonymous.guard';


const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent,
    canLoad: [AnonymousGuard],
    canActivate: [AnonymousGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule {
}
