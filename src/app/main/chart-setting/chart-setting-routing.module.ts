import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartSettingComponent } from './chart-setting/chart-setting.component';

const routes: Routes = [
  {
    path:'',
    component:ChartSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartSettingRoutingModule { }
