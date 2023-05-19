import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as client from './client';
import { VcdSdkConfig } from "./core/plugin.module";

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
})
export class VcdSdkModule {
  static forRoot(config?: VcdSdkConfig): ModuleWithProviders<VcdSdkModule> {
    return {
      ngModule: VcdSdkModule,
      providers: [
        client.RequestHeadersInterceptor,
        client.LoggingInterceptor,
        client.ResponseNormalizationInterceptor,
        client.VcdHttpClient,
        client.VcdApiClient,
        {
          provide: VcdSdkConfig,
          useValue: config || {}
        },
      ]
    };
  }
}