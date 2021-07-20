import { CloudDirectorConfig } from '@vcd/care-package-def';

/**
 * ComponentDeployer constructor function type
 */
export type ComponentDeployerConstructor = new (clientConfig: CloudDirectorConfig, options: any) => ComponentDeployer;
/**
 * Element data write function type
 */
export type ElementStore = (data: any) => void;

/**
 * ComponentDeployer deploy actions from files
 */
export interface ComponentDeployer {
    /**
     * Defines a deployer function which can deploy a group of resources or specific type of resource.
     * Location + pattern describes a list of files, containing resources to be deployed
     * @param location - specifies the absolute path to the folder containing files
     * @param pattern - is a glob pattern describing the files relative to the location
     * @param siblingsData - stored data for sibling elements
     * @param store - data write store function
     */
    deploy(location: string, pattern: string, siblingsData?: any, store?: ElementStore): Promise<any>;

    /**
     * Defines a cleaner function which can clean a group of resources or specific type of resource.
     * Location + pattern describes a list of files, containing resources to be cleaned
     * @param location - specifies the absolute path to the folder containing files
     * @param pattern - is a glob pattern describing the files relative to the location
     */
    clean(location: string, pattern: string): Promise<any>;
}
