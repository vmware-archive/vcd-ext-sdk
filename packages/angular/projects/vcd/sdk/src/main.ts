import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as client from '@vcd/angular-client';

/**
 * Extensions should import this module.
 * They can then wire in SDK components as desired.
 */
@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
  ],
  declarations: [],
  exports: [],
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
