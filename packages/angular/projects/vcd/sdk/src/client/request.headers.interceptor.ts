import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { parseHeaderHateoasLinks } from ".";

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

    private _authenticationHeader = 'Authorization';
    private _authentication: string;
    set authentication(_authentication: string) {
        this._authentication = _authentication;
        this._authenticationHeader = (this._authentication.length > 32) ? 'Authorization' : 'x-vcloud-authorization';
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers;

        if (!headers.has('Accept')) {
            headers = this.setAcceptHeader(headers);
        }

        if (!headers.has('Content-Type')) {
            headers = this.setContentTypeHeader(headers, req.url);
        }

        if (this._authentication) {
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
                    if (!res.headers) {
                        return res;
                    }

                    if (!res.body && res.headers) {
                        (res as { body: any })["body"] = {};
                    }

                    if (res.headers.has("link")) {
                        res.body["link"] = parseHeaderHateoasLinks(res.headers.get("link"));
                    }
                    
                    if (res.headers.has("Link")) {
                        res.body["link"] = parseHeaderHateoasLinks(res.headers.get("Link"));
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
