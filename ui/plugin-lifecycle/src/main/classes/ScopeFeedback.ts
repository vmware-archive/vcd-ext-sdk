import { Organisation } from "../interfaces/Organisation";

export class ScopeFeedback {
    private _forTenant: boolean = false;
    private _forAllTenants: boolean = false;
    private _orgs: Organisation[] = [];

    constructor() {}

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
    }
}