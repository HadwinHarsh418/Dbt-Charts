import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

import { coreConfig } from 'app/app-config';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { fakeBackendProvider } from 'app/auth/helpers'; // used to create fake backend
import { JwtInterceptor, ErrorInterceptor } from 'app/auth/helpers';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { Role } from './auth/models';
import { ChartComponent } from './chart/chart.component';
import { ChartSettingModule } from './main/chart-setting/chart-setting.module';
import { RetrieveChartComponent } from './retrieve-chart/retrieve-chart.component';

const appRoutes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./main/authentication/authentication.module').then(m => m.AuthenticationModule),
  // },
  {
    path: '',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'setting',
    loadChildren: () => import('./main/chart-setting/chart-setting.module').then(m => m.ChartSettingModule),
    data: { roles : [Role.Admin]},
  },
  {
    path:'chart',
    component:ChartComponent
  },
  {
    path:'Retrieve-Chart',
    component:RetrieveChartComponent
  },
  {
    path: 'surveys',
    loadChildren: () => import('./main/surveys/surveys.module').then(m => m.SurveysModule),
    data: { roles : [Role.Admin]},
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgImageFullscreenViewModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
    ChartSettingModule
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend, comment while using real api
    fakeBackendProvider
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
