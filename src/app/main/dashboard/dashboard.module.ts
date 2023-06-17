import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';

import { CoreCommonModule } from '@core/common.module';
import { DashboardService } from 'app/main/dashboard/dashboard.service';

import { AnalyticsComponent } from 'app/main/dashboard/analytics/analytics.component';
import { EcommerceComponent } from 'app/main/dashboard/ecommerce/ecommerce.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const routes = [
  {
    path: '',
    component: EcommerceComponent,
    canActivate: [AuthGuard],
    resolve: {
      css: DashboardService
    }
  },
  // {
  //   path: 'analytics',
  //   component: AnalyticsComponent,
  //   canActivate: [AuthGuard],
  //   // data: { roles: [Role.Admin] },
  //   resolve: {
  //     css: DashboardService,
  //   }
  // },
  {
    path: 'ecommerce',
    component: AnalyticsComponent,
    canActivate: [AuthGuard],
    resolve: {
      css: DashboardService
    }
  },
];

@NgModule({
  declarations: [AnalyticsComponent, EcommerceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule
  ],
  providers: [DashboardService],
  exports: [EcommerceComponent]
})
export class DashboardModule { }
