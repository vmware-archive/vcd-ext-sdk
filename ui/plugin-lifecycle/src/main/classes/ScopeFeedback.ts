import { Organisation } from "../interfaces/Organisation";
import { ChangeScopeItem } from "../interfaces/ChangeScopeItem";

export class ScopeFeedback {
    // Publish for all tenants
    private _publishForAllTenants = false;
    // Unpublish for all tenants
    private _unpublishForAllTenants = false;
    // Is the scope applied for all organisations
    private _forAllOrgs = false;

    // List of scopes ex: ['tenant', 'provider']
    private _scope: string[] = [];
    // List of objects which describe the change scope request
    private _data: ChangeScopeItem[] = [];

    constructor() {}

    // Get publish for all tenants flag
    get publishForAllTenants(): boolean {
        return this._publishForAllTenants;
    }

    // Set publish for all tenants flag
    set publishForAllTenants(val: boolean) {
        this._publishForAllTenants = val;
    }

    // Get unpublish for all tenants flag
    get unpublishForAllTenants(): boolean {
        return this._unpublishForAllTenants;
    }

    // Set unpublish for all tenants flag
    set unpublishForAllTenants(val: boolean) {
        this._unpublishForAllTenants = val;
    }

    // Get for all organisations flag
    get forAllOrgs(): boolean {
        return this._forAllOrgs;
    }

    // Set for all organisations flag
    set forAllOrgs(val: boolean) {
        this._forAllOrgs = val;
    }

    // Set data which describe the change scope request
    set data(data: ChangeScopeItem[]) {
        this._data = data;
    }

    // Get data which describe the change scope request
    get data(): ChangeScopeItem[] {
        return this._data;
    }

    /**
     * Adds new organisation into the organisations list.
     * @param item describes the change scope request
     */
    public addNewOrg(item: ChangeScopeItem): void {
        if (!item) { return; }
        this._data.push(item);
    }

    // Set the scope
    set scope(scope: string[]) {
        this._scope = scope;
    }

    // Get the scope
    get scope(): string[] {
        return this._scope;
    }

    /**
     * Adds new scope into the list of scopes.
     * @param scope scope to be added into the list of scopes
     */
    public addNewScope(scope: string): void {
        this.scope.push(scope);
    }

    /**
     * Remove one scope record from the list of scopes.
     * @param scope scope to be removed from the list
     */
    public removeScope(scope: string): void {
        this.scope.splice(this.scope.indexOf(scope), 1);
    }

    /**
     * Reset all properties.
     */
    public reset(): void {
        this.forAllOrgs = false;
        this.publishForAllTenants = false;
        this.unpublishForAllTenants = false;
        this.data = [];
        this.scope = [];
    }
}
