import { JSONSchema7 } from 'json-schema';
import * as Generator from 'yeoman-generator';
import { CarePackageSourceSpec, CarePackageSpec, Element, ElementSource } from './CarePackage';
import { CloudDirectorConfig } from './CloudDirectorConfig';

export interface SchemaProvider {
    /**
     * Defines the user questionnaire for a given action ("deploy", "build", etc.)
     * @param action
     */
    getInputSchema(action: string): JSONSchema7;
}

/**
 * BuildActionParameters defines parameters within build action
 */
export interface BuildActionParameters {
    packageRoot: string;
    careSpec: CarePackageSourceSpec;
    elements: ElementSource[];
    clientConfig?: CloudDirectorConfig;
    options?: any; //TODO Options can be extracted and defined per action
}

//TODO Think of a better naming
/**
 * BuildActions defines actions for a developer of a solution
 */
export interface BuildActions extends SchemaProvider {
    /**
     * Generates an element for the current plugin
     * @param generator
     * @param answers
     */
    generate?(generator: Generator, answers: any);

    /**
     * Produces artifacts
     * @param params
     */
    build?(params: BuildActionParameters);

    /**
     * Serves the plugin in an emulated environment
     * @param params
     */
    serve?(params: BuildActionParameters);

    /**
     * Adds plugin artifacts to the CARE package
     * @param params
     */
    pack?(params: BuildActionParameters);

    /**
     * Deploys a solution from within the source
     * @param params
     */
    deploy?(params: BuildActionParameters);
}

/**
 * DeployActionParameters defines parameters within deploy action
 */
export interface DeployActionParameters {
    packageRoot: string;
    careSpec: CarePackageSpec;
    elements: Element[];
    clientConfig: CloudDirectorConfig;
    options?: any; //TODO Options can be extracted and defined per action
}

//TODO Think of a better naming
/**
 * DeployActions define actions for a solution manager (such as an admin)
 */
export interface DeployActions extends SchemaProvider {
    /**
     * Deploys a solution from a CARE package
     * @param params
     */
    deploy?(params: DeployActionParameters);

    //TODO Maybe we should remove this definition, not sure if needed here
    publish?(params: DeployActionParameters);
    //TODO Maybe we should remove this definition, not sure if needed here
    unpublish?(params: DeployActionParameters);
    //TODO Maybe we should remove this definition, not sure if needed here
    /**
     * Migrates plugin from old to new version of the CARE package
     * @param params
     */
    upgrade?(params: DeployActionParameters);
}

export interface Plugin {
    name: string;
    displayName: string;
    buildActions: BuildActions;
    deployActions: DeployActions;
}
