export class ChangeScopeFeedback {
    private _forTenant: boolean = false;
    private _forProvider: boolean = false;

    constructor() {}

    get forTenant(): boolean {
        return this._forTenant;
    }

    set forTenant(val: boolean) {
        this._forTenant = val;
    }

    get forProvider(): boolean {
        return this._forProvider;
    }

    set forProvider(val: boolean) {
        this._forProvider = val;
    }
}