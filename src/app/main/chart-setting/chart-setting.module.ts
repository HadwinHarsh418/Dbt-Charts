import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartSettingRoutingModule } from './chart-setting-routing.module';
import { ChartSettingComponent } from './chart-setting/chart-setting.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [ChartSettingComponent],
  imports: [
    CommonModule,
    ChartSettingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule
  ]
})
export class ChartSettingModule { }
