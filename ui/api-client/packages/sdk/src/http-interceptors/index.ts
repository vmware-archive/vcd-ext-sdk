import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoggingInterceptor } from './logging.interceptor';
import { RequestHeadersInterceptor } from './request.headers.interceptor';

export { LoggingInterceptor, RequestHeadersInterceptor };

export const httpInterceptorProviders: any = [
  { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: RequestHeadersInterceptor, multi: true },
];