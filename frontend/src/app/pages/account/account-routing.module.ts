import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountComponent} from './account.component';
import {AuthGuard} from '../../../@dg/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    canLoad: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./creator/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'footage',
        loadChildren: () => import('./creator/footage/footage.module').then(m => m.FootageModule)
      },
      {
        path: 'income',
        loadChildren: () => import('./creator/income/income.module').then(m => m.IncomeModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
