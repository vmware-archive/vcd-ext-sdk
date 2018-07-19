import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
export declare class RequestHeadersInterceptor implements HttpInterceptor {
    private _enabled;
    enabled: boolean;
    private _version;
    version: string;
    private _authentication;
    authentication: string;
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
