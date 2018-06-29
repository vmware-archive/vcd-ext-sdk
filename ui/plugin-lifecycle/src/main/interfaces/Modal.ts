export interface ModalData {
    opened?: boolean;
    title: string;
    body: string;
    accept: string;
    decline?: string;
    waitToClose?: boolean;
}

export class ModalWindow {
    private _opened: boolean;
    private _title: string;
    private _body: string;
    private _accept: string;
    private _decline: string;
    private _waitToClose: boolean;

    constructor() {
        this._opened = false;
        this._title = "";
        this._body = "";
        this._accept = "";
        this._waitToClose = false;
    }

    get opened(): boolean {
        return this._opened;
    }

    set opened(val: boolean) {
        this._opened = val;
    }

    get title(): string {
        return this._title;
    }

    set title(val: string) {
        this._title = val;
    }

    get body(): string {
        return this._body;
    }

    set body(val: string) {
        this._body = val;
    }

    get accept(): string {
        return this._accept;
    }

    set accept(val: string) {
        this._accept = val;
    }

    get decline(): string {
        return this._decline;
    }

    set decline(val: string) {
        this._decline = val;
    }

    get waitToClose(): boolean {
        return this._waitToClose;
    }

    set waitToClose(val: boolean) {
        this._waitToClose = val;
    }
}

