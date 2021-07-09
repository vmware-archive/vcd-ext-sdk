import { JSONSchema7 } from 'json-schema';
import * as Generator from 'yeoman-generator';
import { CarePackageSourceSpec, CarePackageSpec, Element, ElementSource } from './CarePackage';
import { CloudDirectorConfig } from './CloudDirectorConfig';

export interface NewActions {
    getInputSchema(action: string): JSONSchema7;
    generate(plugin: Plugin, generator: Generator, answers: any);
    getConfiguration?(): any;
}

export interface BuildActionParameters {
    packageRoot: string;
    careSpec: CarePackageSourceSpec;
    elements: ElementSource[];
    clientConfig?: CloudDirectorConfig
    options?: any
}

export interface BuildActions {
    build?(params: BuildActionParameters);
    serve?(params: BuildActionParameters);
    pack?(params: BuildActionParameters);
    deploy?(params: BuildActionParameters);
}

export interface DeployActionParameters {
    packageRoot: string;
    careSpec: CarePackageSpec;
    elements: Element[];
    clientConfig: CloudDirectorConfig
    options?: any
}

export interface DeployActions {
    deploy?(params: DeployActionParameters);
    publish?(params: DeployActionParameters);
    unpublish?(params: DeployActionParameters);
    upgrade?(params: DeployActionParameters);
}

export interface Plugin {
    name: string;
    displayName: string;
    newActions: NewActions;
    buildActions: BuildActions;
    deployActions: DeployActions;

    workingDirectory(): string;
}
