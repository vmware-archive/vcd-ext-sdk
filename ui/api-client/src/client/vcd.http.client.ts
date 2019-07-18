import {HttpBackend, HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {LoggingInterceptor} from "./logging.interceptor";
import {RequestHeadersInterceptor} from "./request.headers.interceptor";
import {ResponseNormalizationInterceptor} from "./response.normalization.interceptor";

/**
 * Angular's HttpInterceptorHandler is not publicly exposed.  This is a clone of it.
 */
class VcdHttpInterceptorHandler implements HttpHandler {
    constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {}

    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return this.interceptor.intercept(req, this.next);
    }
}

/**
 * This is a specialist subclass of HttpClient.  The HttpClient that is defined/imported
 * by HttpClientModule is a singleton from the container, meaning that all extensions would
 * get the same one.  We sub-class it so that each extension gets their own instance.
 * Extension consumers should inject this.
 * @see HttpClient
 */
 @Injectable()
 export class VcdHttpClient extends HttpClient {
    /**
     * Provide access to the logging interceptor for enabling/disabling and configuring.
     */
    readonly loggingInterceptor: LoggingInterceptor;

    /**
     * Provide access to the headers interceptor for enabling/disabling and configuring.
     */
    readonly requestHeadersInterceptor: RequestHeadersInterceptor;

    /**
     * Create an HttpClient with the logging and header interceptors in the chain.
     * @param httpBackend backend (likely injected from HttpClientModule)
     * @param hateoasHeaderInterceptor the hateoas header interceptor
     * @param loggingInterceptor the logging interceptor
     * @param requestHeadersInterceptor the request header interceptor
     */
    constructor(httpBackend: HttpBackend,
                loggingInterceptor: LoggingInterceptor,
                requestHeadersInterceptor: RequestHeadersInterceptor,
                responseNormalizationInterceptor: ResponseNormalizationInterceptor) {
        const interceptors: HttpInterceptor[] = [
            loggingInterceptor,
            requestHeadersInterceptor,
            responseNormalizationInterceptor
        ];
        const chain = interceptors.reduceRight(
            (next, interceptor) => new VcdHttpInterceptorHandler(next, interceptor),
            httpBackend
        );
        super(chain);
        this.loggingInterceptor = loggingInterceptor;
        this.requestHeadersInterceptor = requestHeadersInterceptor;
    }
}
