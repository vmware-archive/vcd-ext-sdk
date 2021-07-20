/*
 * These interfaces represent the care package specification
 * https://vmware.github.io/vcd-ext-sdk/architecture/spec/overview
 */


export interface ElementBase {
    name: string;
    type: string;
    /**
     * Defined individually by plugins for configuration purposes
     */
    configuration: any;

    /**
     * Element data write key
     */
    storeWriteKey?: string;

    /**
     * Element data read keys
     */
    storeReadKeys?: string[];
}

export interface Element extends ElementBase {
    location?: string;
}

/**
 * CarePackageSpec represents the manifest care package file, as described in the specification
 */
export interface CarePackageSpec {
    name: string;
    version: string;
    vendor: string;
    specVersion: string;
    elements: Element[];
}

export interface ElementSource extends ElementBase {
    location?: {
        /**
         * Default value is element name
         * Can be overridden in care.json
         */
        base?: string;
        /**
         * Build artifact directory
         * Default value depends on the plugin type
         * Can be overridden in care.json
         */
        outDir?: string;
        /**
         * The deliverables of a given plugin
         * Default value depends on the plugin type
         * Can be overridden in care.json
         */
        files?: string;
    };
}

/**
 * CarePackageSourceSpec represents the care.json file for the source of a solution
 */
export interface CarePackageSourceSpec {
    name: string;
    version: string;
    vendor: string;
    specVersion: string;
    elements: ElementSource[];
}
