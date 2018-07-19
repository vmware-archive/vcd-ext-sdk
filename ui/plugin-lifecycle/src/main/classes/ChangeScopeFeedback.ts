export class ChangeScopeFeedback {
    private _forTenant: boolean = false;
    private _forAllTenants: boolean = false;

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
}