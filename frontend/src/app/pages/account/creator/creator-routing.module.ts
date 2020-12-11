import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreatorComponent} from "./creator.component";
import {ProfileComponent} from "./profile/profile.component";
import {FootageComponent} from "./footage/footage.component";
import {IncomeComponent} from "./income/income.component";

const routes: Routes = [
  {
    path:'',
    component: CreatorComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'footage',
        loadChildren: () => import('./footage/footage.module').then(m => m.FootageModule)
      },
      {
        path: 'income',
        loadChildren: () => import('./income/income.module').then(m => m.IncomeModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatorRoutingModule { }
