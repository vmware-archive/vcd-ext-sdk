import { Injectable, Optional } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler,
  HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ApiResultService, ApiResult } from './api.result.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private _outputToConsole: boolean;
  private _enabled: boolean = false;
  set enabled(enabled: boolean) {
    this._enabled = enabled;
    if (this._enabled && this._outputToConsole) {
      console.warn('API logging enabled but no provider found for ApiResultService.  Results will be output to the console.');
    }
  }

  constructor(@Optional() private apiResultService: ApiResultService) {
    this._outputToConsole = !this.apiResultService;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this._enabled) {
      return next.handle(req);
    }

    const started = new Date();
    let succeeded: boolean;

    return next.handle(req)
      .pipe(
        tap(
          event => succeeded = event instanceof HttpResponse ? true : false,
          error => succeeded = false
        ),
        finalize(() => {
          if (this._outputToConsole) {
            console.log(`${req.method} ${req.urlWithParams} completed in ${Date.now() - started.getTime()} ms.  Success: ${succeeded}`);
          } else {
            this.apiResultService.add(new ApiResult(`${req.method} ${req.urlWithParams}`, succeeded, started, new Date()));
          }
        })
      );
  }
}