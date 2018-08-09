import { Injectable } from "@angular/core";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { RequestTracker } from "../classes/RequestTracker";

@Injectable()
export class ChangeOrgScopeService extends RequestTracker<ChangeScopeRequest> {
    /**
     * Setting the status of the request which be made.
     * @param url the url of the request
     * @param value the status of the request
     */
    public changeReqStatusTo(url: string, value: boolean) {
        const found = this._requests.find((el: ChangeScopeRequest) => {
            return el.reqUrl === url;
        });
        const index = this._requests.indexOf(found);

        if (index === -1) {
            /* This is double check because the plugin is in development and it runs under localhost,
            so the URL of the REQ and RES can be different, and this is how the request is identified (by URL).
            In other words it's possible the URL to be not in the list.
            */
            const urlCheck = url.split(window.location.origin);
            if (urlCheck[0].length !== 0 && !urlCheck[1]) {
                console.error("This element does not exist!");
                return;
            }
            this.changeReqStatusTo(urlCheck[1], value);
            return;
        }

        this._requests[index].status = value;
        this._requestSubject.next(this._requests);
    }
}
