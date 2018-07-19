export declare class ApiResultService {
    private _results;
    readonly results: ApiResult[];
    add(result: ApiResult): void;
    clear(): void;
}
export declare class ApiResult {
    private _message;
    readonly message: string;
    private _succeeded;
    readonly succeeded: boolean;
    private _started;
    readonly started: Date;
    private _finished;
    readonly finished: Date;
    constructor(message: string, succeeded: boolean, started: Date, finished: Date);
}
