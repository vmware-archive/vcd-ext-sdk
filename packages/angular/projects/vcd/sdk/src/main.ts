import {HttpClientModule} from '@angular/common/http';
import {NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';

import * as client from '@vcd/angular-client';
import * as common from './common';
import * as core from './core';
import * as i18n from './i18n';

export {
  common,
  core,
  i18n,
};

/**
 * Extensions should import this module.  They can then wire in SDK components as desired.
 */
@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
  ],
  declarations: [i18n.TranslatePipe],
  exports: [i18n.TranslatePipe],
  providers: [
    i18n.TranslateService,
    i18n.TranslationLoader,
    client.RequestHeadersInterceptor,
    client.LoggingInterceptor,
    client.ResponseNormalizationInterceptor,
    client.VcdHttpClient,
    client.VcdApiClient,
  ]
})
export class VcdSdkModule {
}
