import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VcdApiClient } from './vcd.api.client';
import { httpInterceptorProviders } from './http-interceptors';

export * from './container-hooks';
export * from './vcd.api.client';
export * from './query';
export * from './api.result.service';

export { httpInterceptorProviders };

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  exports: [],
  providers: [VcdApiClient,httpInterceptorProviders]
})
export class VcdSdkModule {
}
