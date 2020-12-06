import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomLayoutComponent} from './custom-layout/custom-layout.component';
import {HomeComponent} from "./pages/home/home.component";
import {AnonymousGuard} from "../@dg/guards/anonymous.guard";
import {AuthGuard} from "../@dg/guards/auth.guard";


const routes: Routes = [
  {
    path: '',
    component: CustomLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
      {
        path: 'account',
        loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'pricing',
        loadChildren: () => import('./pages/pricing/pricing.module').then(m => m.PricingModule),
        canActivate:[]
      },
      {
        path: 'login',
        loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule),
        canActivate:[AnonymousGuard]
      },
      {
        path: 'register',
        loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterModule),
        canActivate:[AnonymousGuard]
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
        canActivate:[AnonymousGuard]
      },
      {
        path: '**',
        loadChildren: () => import('./pages/errors/error-404/error-404.module').then(m => m.Error404Module)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
