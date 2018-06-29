import { Injectable } from "@angular/core";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { Subject, Observable } from "rxjs";

@Injectable()
export class ChangeOrgScopeService {
    private _changeScopeReq: ChangeScopeRequest[] = [];
    private _changeScopeReqSubject = new Subject<ChangeScopeRequest[]>();
    
    constructor() {}

    public addChangeScopeReq(req: ChangeScopeRequest): void {
        this._changeScopeReq.push(req);
        this._changeScopeReqSubject.next(this._changeScopeReq);
    }

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

    public clearChangeScopeReq(): void {
        this._changeScopeReq = [];
        this._changeScopeReqSubject.next(this._changeScopeReq);
    }

    public watchChangeScopeReq(): Observable<ChangeScopeRequest[]> {
        return this._changeScopeReqSubject.asObservable();
    }
}