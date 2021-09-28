import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AccountComponent} from './account.component';
import {AuthGuard} from '../../../@dg/guards/auth.guard';
import {RoleGuard} from '../../../@dg/guards/role.guard';


const routes: Routes = [
    {
        path: '',
        component: AccountComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'creator',
                loadChildren: () => import('./creator/profile/profile.module').then(m => m.ProfileModule),
                data: {
                    expectedRole: 'ROLE_CREATOR'
                },
                canLoad: [RoleGuard]
            },
            {
                path: 'footage',
                loadChildren: () => import('./creator/footage/footage.module').then(m => m.FootageModule),
                data: {
                    expectedRole: 'ROLE_CREATOR'
                },
                canLoad: [RoleGuard]
            },
            {
                path: 'income',
                loadChildren: () => import('./creator/income/income.module').then(m => m.IncomeModule),
                data: {
                    expectedRole: 'ROLE_CREATOR'
                },
                canLoad: [RoleGuard]
            },
            {
                path: 'profile',
                loadChildren: () => import('./member/profile/profile.module').then(m => m.ProfileModule),
                data: {
                    expectedRole: 'ROLE_MEMBER'
                },
                canLoad: [RoleGuard]
            },
            {
                path: 'credits',
                loadChildren: () => import('./member/credits/credits.module').then(m => m.CreditsModule),
                data: {
                    expectedRole: 'ROLE_MEMBER'
                },
                canLoad: [RoleGuard]
            },
            {
                path: 'history',
                loadChildren: () => import('./member/history/history.module').then(m => m.HistoryModule),
                data: {
                    expectedRole: 'ROLE_MEMBER'
                },
                canLoad: [RoleGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {
}
