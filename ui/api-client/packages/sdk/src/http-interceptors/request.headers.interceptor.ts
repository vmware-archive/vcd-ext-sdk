import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestHeadersInterceptor implements HttpInterceptor {
    private _enabled: boolean = true;
    set enabled(_enabled: boolean) {
        this._enabled = _enabled;
    }
    
    private _version: string = '31.0';
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
        let headers = req.headers.set('Accept', [`application/*+json;version=${this._version}`, `application/json;version=${this._version}`]);
        if (this._authentication) {
            headers = headers.set(this._authenticationHeader, `${this._authentication}`);
        }
            
        const customReq: HttpRequest<any> = req.clone({
            headers: headers
        });
        
        return next.handle(customReq);
    }
}