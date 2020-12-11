import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FootageComponent} from "./footage.component";

const routes: Routes = [
  {
    path: '',
    component: FootageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootageRoutingModule { }
