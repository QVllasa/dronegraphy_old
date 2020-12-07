import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CockpitComponent} from "./cockpit.component";

const routes: Routes = [
  {
    path:'',
    component: CockpitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CockpitRoutingModule { }
