import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomLayoutComponent} from './custom-layout/custom-layout.component';
import {AuthGuard} from '../@dg/guards/auth.guard';
import {AuthResolver} from "../@dg/resolver/auth.resolver";


const routes: Routes = [
    {
        path: '',
        component: CustomLayoutComponent,
        resolve: {user: AuthResolver},
        children: [
            {
                path: '',
                loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
            },
            {
                path: 'account',
                loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule),
                // canLoad: [AuthGuard]
            },
            {
                path: 'cockpit',
                loadChildren: () => import('./pages/cockpit/cockpit.module').then(m => m.CockpitModule),
                // canLoad: [AuthGuard]
            },
            {
                path: 'checkout',
                loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule),
                // canLoad: [AuthGuard]
            },
            {
                path: 'pricing',
                loadChildren: () => import('./pages/pricing/pricing.module').then(m => m.PricingModule),

            },
            {
                path: 'login',
                loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule),

            },
            {
                path: 'register',
                loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
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
