import { Injectable } from "@angular/core";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { RequestTracker } from "../classes/RequestTracker";
import { Observable } from "rxjs";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { getPropsWithout } from "../helpers/object-helpers";

@Injectable()
export class ChangeOrgScopeService extends RequestTracker<ChangeScopeRequest> {
    /**
     * Setting the status of the request which be made.
     * @param url the url of the request
     * @param value the status of the request
     */
    public handleCompletedRequest(res: HttpResponse<any> | HttpErrorResponse) {
        const found = this._requests.find((el: ChangeScopeRequest) => {
            return el.reqUrl === res.url;
        });
        const index = this._requests.indexOf(found);

        if (index === -1) {
            /* This is double check because the plugin is in development and it runs under localhost,
            so the URL of the REQ and RES can be different, and this is how the request is identified (by URL).
            In other words it's possible the URL to be not in the list.
            */
            const urlCheck = res.url.split(window.location.origin);
            if (urlCheck[0].length !== 0 && !urlCheck[1]) {
                console.error("This element does not exist!");
                return;
            }
            // Immutable copy
            const resCopy = getPropsWithout(["url"], res);
            resCopy.url = urlCheck[1];
            this.handleCompletedRequest(resCopy);
            return;
        }

        this._requests[index].status = res.status !== 200 ? false : true;
        this._requestSubject.next(this._requests);
    }

    public executeRequestsInParallel(): Observable<HttpResponse<any>> {
        return Observable.merge(...this._requests.map((req) => req.request))
            .map((res) => {
                this.handleCompletedRequest(res);
                return res;
            });
    }
}
