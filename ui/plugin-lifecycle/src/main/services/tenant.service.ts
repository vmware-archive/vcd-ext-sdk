import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { VcdApiClient } from "@vcd/sdk";
import { Query } from "@vcd/sdk/query";
import { QueryResultRecordsType, QueryResultOrgRecordType } from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import { tap } from "rxjs/operators";

@Injectable()
export class TenantService {
    private _orgsSubject = new BehaviorSubject<QueryResultOrgRecordType[]>([]);

    constructor(
        private client: VcdApiClient
    ) {
        // Load the tenants
        this.loadOrgs();
    }

    /**
     * Observe the list of tenants.
     */
    public watchOrgs(): Observable<QueryResultRecordsType[]> {
        return this._orgsSubject.asObservable();
    }

    /**
     * Refresh the list of tenants.
     */
    public refresh() {
        this.loadOrgs();
    }

    /**
     * Make request to take all existing organistaions.
     */
    private loadOrgs(): void {
        const subs = this.getAllTenants()
            .subscribe(() => {
                // Handle subscription
            }, (error) => {
                console.error(error);
                subs.unsubscribe();
            }, () => {
                subs.unsubscribe();
            });
    }

    /**
     * Creates a request to take all tenants.
     */
    private getAllTenants(): Observable<QueryResultRecordsType> {
        return this.client.query(Query.Builder.ofType("organization")).pipe(
            tap((result: QueryResultRecordsType) => {
                this._orgsSubject.next((result.record as QueryResultOrgRecordType[]));
            })
        );
    }
}
