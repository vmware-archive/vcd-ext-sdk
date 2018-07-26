import { Organisation } from "../interfaces/Organisation";
import { ChangeScopeItem } from "../interfaces/ChangeScopeItem";

export class ScopeFeedback {
    private _publishForAllTenants: boolean = false;
    private _unpublishForAllTenants: boolean = false;
    private _forAllOrgs: boolean = false;

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

    public addNewOrg(org: ChangeScopeItem): void {
        if (!org) { return; }
        this._data.push(org);
    }

    public reset(): void {
        this.forAllOrgs = false;
        this.publishForAllTenants = false;
        this.unpublishForAllTenants = false;
        this.data = [];
    }
}