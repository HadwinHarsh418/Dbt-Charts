import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { CsvModule } from '@ctrl/ngx-csv';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';

import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SurveysComponent } from './surveys.component';
import { SurveyComponent } from './survey/survey.component';
import { SurveyService } from './surveys.service';

const routes = [
  {
    path: '',
    component: SurveysComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view/:survey_id',
    component: SurveyComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [SurveysComponent, SurveyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule,
    CsvModule,
  ],
  providers: [SurveyService],
  exports: [SurveysComponent, SurveyComponent]
})
export class SurveysModule { }
