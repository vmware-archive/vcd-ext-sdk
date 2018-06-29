import { Injectable } from '@angular/core';

@Injectable()
export class ApiResultService {
    private _results: ApiResult[] = [];
    public get results(): ApiResult[] {
        return this._results;
    }

    add(result: ApiResult) {
        this._results = [result, ...this._results.slice(0, 99)];
    }

    clear() {
        this._results = [];
    }
}

export class ApiResult {
    private _message: string;
    public get message(): string {
        return this._message;
    }

    private _succeeded: boolean;
    public get succeeded(): boolean {
        return this._succeeded;
    }

    private _started: Date;
    public get started(): Date {
        return this._started;
    }

    private _finished: Date;
    public get finished(): Date {
        return this._finished;
    }

    constructor(message: string, succeeded: boolean, started: Date, finished: Date) {
        this._message = message;
        this._succeeded = succeeded;
        this._started = started;
        this._finished = finished;
    }
}