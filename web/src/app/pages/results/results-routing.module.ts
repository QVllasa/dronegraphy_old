import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResultsComponent} from './results.component';



const routes: Routes = [
  {
    path: ':category',
    component: ResultsComponent,
    // pathMatch: 'full'
  },
  {
    path: '',
    component: ResultsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsRoutingModule { }
