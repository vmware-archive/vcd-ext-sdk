import { Injectable } from "@angular/core";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { Subject, Observable } from "rxjs";

@Injectable()
export class ChangeOrgScopeService {
    private _changeScopeReq: ChangeScopeRequest[] = [];
    private _changeScopeReqSubject = new Subject<ChangeScopeRequest[]>();

    constructor() { }

    /**
     * Adds new request into the list.
     * @param req request which be made
     */
    public addChangeScopeReq(req: ChangeScopeRequest): void {
        this._changeScopeReq.push(req);
        // Emits new list to all subscribers
        this._changeScopeReqSubject.next(this._changeScopeReq);
    }

    /**
     * Setting the status of the request which be made.
     * @param url the url of the request
     * @param value the status of the request
     */
    public changeReqStatusTo(url: string, value: boolean) {
        const found = this._changeScopeReq.find((el: ChangeScopeRequest) => {
            return el.reqUrl === url;
        });
        const index = this._changeScopeReq.indexOf(found);

        if (index === -1) {
            console.error('This element does not exist!');
            return;
        }

        this._changeScopeReq[index].status = value;
        this._changeScopeReqSubject.next(this._changeScopeReq);
    }

    /**
     * Clear the list of requests.
     */
    public clearChangeScopeReq(): void {
        this._changeScopeReq = [];
        // Emit the new list to all subscribers
        this._changeScopeReqSubject.next(this._changeScopeReq);
    }

    /**
     * Observe the list of the requests.
     */
    public watchChangeScopeReq(): Observable<ChangeScopeRequest[]> {
        return this._changeScopeReqSubject.asObservable();
    }
}