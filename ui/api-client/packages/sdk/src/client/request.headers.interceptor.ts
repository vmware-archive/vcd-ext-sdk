import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestHeadersInterceptor implements HttpInterceptor {
    private _enabled: boolean = true;
    set enabled(_enabled: boolean) {
        this._enabled = _enabled;
    }

    private _version: string = '';
    get version(): string {
        return this._version;
    }
    set version(_version: string) {
        this._version = _version;
    }

    private _authenticationHeader: string = 'Authorization';
    private _authentication: string;
    set authentication(_authentication: string) {
        this._authentication = _authentication;
        this._authenticationHeader = (this._authentication.length > 32) ? 'Authorization' : 'x-vcloud-authorization';
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers;

        if (!headers.has("Accept")) {
            headers = this.setAcceptHeader(headers);
        }

        if (!headers.has("Content-Type")) {
            headers = this.setContentTypeHeader(headers, req.url);
        }

        if (this._authentication) {
            headers = headers.set(this._authenticationHeader, this._authentication);
        }

        const customReq: HttpRequest<any> = req.clone({
            headers: headers
        });

        return next.handle(customReq);
    }

    private setAcceptHeader(headers: HttpHeaders): HttpHeaders {
        const value = headers.get('_multisite');
        headers = headers.delete('_multisite');

        return headers.set(
            'Accept', [
                `application/*+json;version=${this._version}${value ? `;multisite=${value}` : ''}`,
                `application/json;version=${this._version}${value ? `;multisite=${value}` : ''}`
            ]
        );
    }

    private setContentTypeHeader(headers: HttpHeaders, url: string): HttpHeaders {
        if (url.indexOf("cloudapi") > -1) {
            return headers.set('Content-Type', 'application/json');
        } else {
            return headers.set('Content-Type', 'application/*+json');
        }
    }
}
