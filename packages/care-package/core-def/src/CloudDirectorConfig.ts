export interface TransferClient {
    upload(filePath: string, contentType: string): Promise<any>;
}

export interface Authentication {
}

export interface ApiType {
    setDefaultAuthentication(config: Authentication): void;
}
declare type ApiConstructor<T extends ApiType> = new () => T;

export interface CloudDirectorConfig {
    token: string;
    basePath: string;
    makeApiClient<T extends ApiType>(apiClientType: ApiConstructor<T>): T;
    makeTransferClient(url: string): TransferClient;
}
