import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomLayoutComponent} from './custom-layout/custom-layout.component';
import {HomeComponent} from './pages/home/home.component';
import {AnonymousGuard} from '../@dg/guards/anonymous.guard';
import {AuthGuard} from '../@dg/guards/auth.guard';


const routes: Routes = [
    {
        path: '',
        component: CustomLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
            },
            {
                path: 'account',
                loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule),
                canLoad: [AuthGuard]
            },
            {
                path: 'pricing',
                loadChildren: () => import('./pages/pricing/pricing.module').then(m => m.PricingModule),

            },
            {
                path: 'login',
                loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule),
                canLoad: [AnonymousGuard]

            },
            {
                path: 'register',
                loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterModule),
                canLoad: [AnonymousGuard]
            },
            {
                path: 'forgot-password',
                loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
                canLoad: [AnonymousGuard]
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
