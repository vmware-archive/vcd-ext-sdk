import { Observable, BehaviorSubject } from "rxjs";

export abstract class RequestTracker<T> {
    protected _requests: T[] = [];
    protected _requestSubject = new BehaviorSubject<T[]>([]);

    constructor() {}

    /**
     * Adds new request into the list.
     * @param req request which will be made
     */
    public addChangeScopeReq(req: T): void {
        this._requests.push(req);
        // Emits new list to all subscribers
        this._requestSubject.next(this._requests);
    }

    /**
     * Clear the list of requests.
     */
    public clearChangeScopeReq(): void {
        this._requests = [];
        // Emit the new list to all subscribers
        this._requestSubject.next(this._requests);
    }

    /**
     * Observe the list of the requests.
     */
    public watchChangeScopeReq(): Observable<T[]> {
        return this._requestSubject.asObservable();
    }

}
