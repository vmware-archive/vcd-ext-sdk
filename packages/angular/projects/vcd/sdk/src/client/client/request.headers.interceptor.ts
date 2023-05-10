import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseHeaderHateoasLinks } from '.';
import { HTTP_HEADERS } from './constants';

// tslint:disable:variable-name
@Injectable()
export class RequestHeadersInterceptor implements HttpInterceptor {
    private _enabled = true;
    set enabled(_enabled: boolean) {
        this._enabled = _enabled;
    }

    private _actAs: string;
    set actAs(_actAs: string) {
        this._actAs = _actAs;
    }

    private _version = '';
    get version(): string {
        return this._version;
    }
    set version(_version: string) {
        this._version = _version;
    }

    private _authenticationHeader: string = HTTP_HEADERS.Authorization;
    private _authentication: string;
    set authentication(_authentication: string) {
        this._authentication = _authentication;
        this._authenticationHeader = (this._authentication && this._authentication.length > 32) ?
            HTTP_HEADERS.Authorization : HTTP_HEADERS.x_vcloud_authorization;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers;

        if (!headers.has('Accept')) {
            headers = this.setAcceptHeader(headers);
        }

        if (!headers.has('Content-Type')) {
            headers = this.setContentTypeHeader(headers, req.url);
        }

        if (this._authentication && !headers.has(HTTP_HEADERS.Authorization)) {
            headers = headers.set(this._authenticationHeader, this._authentication);
        }

        if (this._actAs) {
            headers = headers.set('X-VMWARE-VCLOUD-TENANT-CONTEXT', this._actAs);
        }

        const customReq: HttpRequest<any> = req.clone({
            headers
        });

        return next.handle(customReq).pipe(
            map((res: HttpEvent<any>) => {
                if (res instanceof HttpResponse) {
                    if (!res.body || !res.headers) {
                        return res;
                    }

                    if (res.headers.has(HTTP_HEADERS.link)) {
                        res.body.link = parseHeaderHateoasLinks(res.headers.get(HTTP_HEADERS.link));
                    }

                    if (res.headers.has(HTTP_HEADERS.Link)) {
                        res.body.link = parseHeaderHateoasLinks(res.headers.get(HTTP_HEADERS.Link));
                    }

                    if (res.headers.has(HTTP_HEADERS.etag)) {
                        res.body.etag = res.headers.get(HTTP_HEADERS.etag);
                    }
                }
                return res;
            })
        );
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
        if (url.indexOf('cloudapi') > -1) {
            return headers.set('Content-Type', 'application/json');
        } else {
            return headers.set('Content-Type', 'application/*+json');
        }
    }
}
