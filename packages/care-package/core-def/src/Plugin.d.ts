import { JSONSchema7 } from 'json-schema';
import * as Generator from 'yeoman-generator';
import { CarePackageSourceSpec, CarePackageSpec, Element, ElementSource } from './CarePackage';
import { CloudDirectorConfig } from './CloudDirectorConfig';

export interface SchemaProvider {
    getInputSchema(action: string): JSONSchema7;
}

export interface BuildActionParameters {
    packageRoot: string;
    careSpec: CarePackageSourceSpec;
    elements: ElementSource[];
    clientConfig?: CloudDirectorConfig
    options?: any
}

export interface BuildActions extends SchemaProvider {
    generate?(generator: Generator, answers: any);
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

export interface DeployActions extends SchemaProvider {
    deploy?(params: DeployActionParameters);
    publish?(params: DeployActionParameters);
    unpublish?(params: DeployActionParameters);
    upgrade?(params: DeployActionParameters);
}

export interface Plugin {
    name: string;
    displayName: string;
    buildActions: BuildActions;
    deployActions: DeployActions;
}
