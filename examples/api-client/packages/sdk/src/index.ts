import {HttpClientModule} from "@angular/common/http";
import {NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';

import * as client from './client';
import * as query from './query';
import * as common from './common';
import * as core from './core';
import * as i18n from './i18n';

export {
  client,
  common,
  core,
  i18n,
  query
};

// These exports, for legacy reasons, are exposed at the top level.
const {VcdApiClient, ApiResultService} = client;
export {VcdApiClient, ApiResultService};

/**
 * Extensions should import this module.  They can then wire in SDK components as desired.
 */
@NgModule({
  imports: [HttpClientModule, CommonModule],
  declarations: [i18n.TranslatePipe],
  exports: [i18n.TranslatePipe],
  providers: [
      client.RequestHeadersInterceptor,
      client.LoggingInterceptor,
      client.VcdHttpClient,
      client.VcdApiClient,

      i18n.TranslateService,
      i18n.TranslationLoader
  ]
})
export class VcdSdkModule {
}
