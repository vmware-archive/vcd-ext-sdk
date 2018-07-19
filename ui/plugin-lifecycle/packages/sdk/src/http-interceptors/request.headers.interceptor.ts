import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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
    
    private _authentication: string;
    set authentication(_authentication: string) {
        this._authentication = _authentication;
    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers.set('Accept', `application/*+json;version=${this._version}`);
        if (this._authentication) {
            headers = headers.set('Authorization', `${this._authentication}`);
        }
            
        const customReq: HttpRequest<any> = req.clone({
            headers: headers
        });
        
        return next.handle(customReq);
    }
}