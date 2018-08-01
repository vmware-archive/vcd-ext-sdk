import { Organisation } from "../interfaces/Organisation";
import { ChangeScopeItem } from "../interfaces/ChangeScopeItem";

export class ScopeFeedback {
    private _publishForAllTenants: boolean = false;
    private _unpublishForAllTenants: boolean = false;
    private _forAllOrgs: boolean = false;

    private _scope: string[] = [];
    private _data: ChangeScopeItem[] = [];

    constructor() {}

    get publishForAllTenants(): boolean {
        return this._publishForAllTenants;
    }

    set publishForAllTenants(val: boolean) {
        this._publishForAllTenants = val;
    }

    get unpublishForAllTenants(): boolean {
        return this._unpublishForAllTenants;
    }

    set unpublishForAllTenants(val: boolean) {
        this._unpublishForAllTenants = val;
    }

    get forAllOrgs(): boolean {
        return this._forAllOrgs;
    }

    set forAllOrgs(val: boolean) {
        this._forAllOrgs = val;
    }

    set data(data: ChangeScopeItem[]) {
        this._data = data;
    }

    get data(): ChangeScopeItem[] {
        return this._data
    }

    /**
     * Adds new organisation into the organisations list.
     * @param org organisation to be added in the list
     */
    public addNewOrg(org: ChangeScopeItem): void {
        if (!org) { return; }
        this._data.push(org);
    }

    set scope(scope: string[]) {
        this._scope = scope;
    }

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