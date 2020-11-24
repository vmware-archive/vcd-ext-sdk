export interface ComponentDeployer {
    deploy(location: string): Promise<any>;
    clean(location: string): Promise<any>;
}
