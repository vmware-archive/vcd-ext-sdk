import { Organisation } from "../interfaces/Organisation";

export class ScopeFeedback {
    private _forTenant: boolean = false;
    private _unpublishForTenant: boolean = false;

    private _forAllTenants: boolean = false;
    private _unpublishForAllTenants: boolean = false;

    private _orgs: Organisation[] = [];

    constructor() {}

    // Publishing...
    get forTenant(): boolean {
        return this._forTenant;
    }

    set forTenant(val: boolean) {
        this._forTenant = val;
    }

    get forAllTenants(): boolean {
        return this._forAllTenants;
    }

    set forAllTenants(val: boolean) {
        this._forAllTenants = val;
    }

    // Unpublishing...
    get unpublishForTenant(): boolean {
        return this._unpublishForTenant;
    }

    set unpublishForTenant(val: boolean) {
        this._unpublishForTenant = val;
    }

    get unpublishForAllTenants(): boolean {
        return this._unpublishForAllTenants;
    }

    set unpublishForAllTenants(val: boolean) {
        this._unpublishForAllTenants = val;
    }

    // Orgs...
    get orgs(): Organisation[] {
        return this._orgs;
    }

    set orgs(orgs: Organisation[]) {
        this._orgs = orgs;
    }

    public addNewOrg(org: Organisation): void {
        if (!org) { return; }
        this._orgs.push(org);
    }

    public reset(): void {
        this.forAllTenants = false;
        this.forTenant = false;
        this.unpublishForAllTenants = false;
        this.unpublishForTenant = false;
    }
}