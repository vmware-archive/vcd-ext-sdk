import { CloudDirectorConfig } from '@vcd/care-package-def';

export type ComponentDeployerConstructor = new (clientConfig: CloudDirectorConfig, options: any) => ComponentDeployer;
export interface ComponentDeployer {
    deploy(location: string, pattern: string): Promise<any>;
    clean(location: string, pattern: string): Promise<any>;
}
