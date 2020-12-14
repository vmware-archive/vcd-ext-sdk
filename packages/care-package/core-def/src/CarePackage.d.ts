export interface ElementBase {
    name: string;
    type: string;
    configuration: any;
}

export interface Element extends ElementBase {
    location?: string;
}
export interface CarePackageSpec {
    name: string;
    version: string;
    vendor: string;
    specVersion: string;
    elements: Element[];
}

export interface ElementSource extends ElementBase {
    location?: {
        base?: string;
        outDir?: string;
        files?: string;
    };
}
export interface CarePackageSourceSpec {
    name: string;
    version: string;
    vendor: string;
    specVersion: string;
    elements: ElementSource[];
}
