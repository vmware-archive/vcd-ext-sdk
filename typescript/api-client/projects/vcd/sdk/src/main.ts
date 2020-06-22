import {HttpClientModule} from '@angular/common/http';
import {NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';

import * as client from './client';
import * as query from './query';
import * as common from './common';
import * as core from './core';

// These exports, for legacy reasons, are exposed at the top level.
import VcdApiClient = client.VcdApiClient;
import ApiResultService = client.ApiResultService;

export {
  client,
  common,
  core,
  query,
  VcdApiClient,
  ApiResultService
};

/**
 * Extensions should import this module.  They can then wire in SDK components as desired.
 */
@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
  ],
  providers: [
    client.RequestHeadersInterceptor,
    client.LoggingInterceptor,
    client.ResponseNormalizationInterceptor,
    client.VcdHttpClient,
    client.VcdApiClient,
  ]
})
export class VcdSdkModule {
}
