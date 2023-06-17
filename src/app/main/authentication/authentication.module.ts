import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import { AuthLoginV2Component } from './auth-login-v2/auth-login-v2.component';

import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { TranslateModule } from '@ngx-translate/core';
import { LangselectorComponent } from 'app/layout/components/langselector/langselector.component';
// routing
const routes: Routes = [
  {
    path: '',
    component: AuthLoginV2Component
  },
  {
    path: 'login',
    component: AuthLoginV2Component
  },
];

@NgModule({
  declarations: [
    // AuthLoginV1Component,
    AuthLoginV2Component,
    LangselectorComponent,
  ],
  imports: [CommonModule, RecaptchaModule, TranslateModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule]
})
export class AuthenticationModule {}
