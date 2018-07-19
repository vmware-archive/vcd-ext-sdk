import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiResultService } from '../api.result.service';
export declare class LoggingInterceptor implements HttpInterceptor {
    private apiResultService;
    private _outputToConsole;
    private _enabled;
    enabled: boolean;
    constructor(apiResultService: ApiResultService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
