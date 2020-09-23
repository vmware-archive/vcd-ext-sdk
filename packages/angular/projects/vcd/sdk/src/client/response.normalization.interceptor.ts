import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable:jsdoc-format
/**
 * An interceptor on the response chain that normalizes differences in
 * JSON payloads between vCloud Director version 9.1 and versions
 * greater than 9.1.
 *
 * In 9.1 (API version 30.0) the server serializes JSON and nests the payload in a value field:
 * ```
  {
    "name" : "{http://www.vmware.com/vcloud/versions}SupportedVersions",
    "declaredType" : "com.vmware.vcloud.api.rest.schema.versioning.SupportedVersionsType",
    "scope" : "javax.xml.bind.JAXBElement$GlobalScope",
    "value" : {
      "versionInfo" : [],
      "any" : [],
      "otherAttributes" : {}
    }
  }
  ```
 *
 * That same request in API versions 31.0 and above is represented as:
 * ```
  {
    "versionInfo" : [],
    "any" : [],
    "otherAttributes" : {}
  }
  ```
 * This interceptor should process responses before any other interceptors that rely
 * on consistent API information.
 */
@Injectable()
export class ResponseNormalizationInterceptor implements HttpInterceptor {
  private static readonly QUERY_RESULT_TYPE = 'com.vmware.vcloud.api.rest.schema_v1_5.QueryResultRecordsType';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(response => {
        // While this condition seems awfully specific, the alternative option of examining the 'Content-Type'
        // response header for 'version=30.0' proved to be an unreliable condition in at least one case;
        // returning the same JSON payload as API versions >= 31.0.
        if (response instanceof HttpResponse && response.body && response.body.value && response.body.declaredType && response.body.scope) {
          const body = response.body.value;
          if (response.body.declaredType === ResponseNormalizationInterceptor.QUERY_RESULT_TYPE) {
            body.record = body.record.map(record => record.value);
          }

          return response.clone({ body });
        }

        return response;
      })
    );
  }
}
