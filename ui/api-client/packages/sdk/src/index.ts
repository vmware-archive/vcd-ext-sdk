import { ModuleWithProviders , NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VcdApiClient } from './vcd.api.client';
import { httpInterceptorProviders } from './http-interceptors';

import * as query from './query';
import * as common from './common';

export * from './vcd.api.client';
export * from './api.result.service';

export { 
  common,
  httpInterceptorProviders,
  query
};

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  exports: [],
  providers: [httpInterceptorProviders, VcdApiClient]
})
export class VcdSdkModule {
}
