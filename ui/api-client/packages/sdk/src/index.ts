import { ModuleWithProviders , NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VcdApiClient } from './vcd.api.client';
import { httpInterceptorProviders } from './http-interceptors';

import * as query from './query';
import * as common from './common';
import * as core from './core';
import * as i18n from './i18n';

export * from './vcd.api.client';
export * from './api.result.service';

export { 
  common,
  core,
  httpInterceptorProviders,
  i18n,
  query
};

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [i18n.TranslatePipe],
  exports: [i18n.TranslatePipe],
  providers: [httpInterceptorProviders, VcdApiClient, i18n.TranslateService, i18n.TranslationLoader]
})
export class VcdSdkModule {
}
