export interface ObjectDeployer {
    deploy(): Promise<any>;
    clean(): Promise<any>;
}