import { Rule } from "@angular-devkit/schematics";
import { Schema } from "./schema";

export  interface Manifest {
    containerVersion: string;
    extensionPoints: ExtensionPointManifest[];
}

/**
 * This defines a formal extension point.  An extension point is a declarative way for an extension manifest
 * to describe how the VCD application behaviour is extended or modified by the extension.
 */
export interface ExtensionPointManifest {
    /**
     * Universally unique URN that identifies this Extension Point.  It is suggested to preprend the extension's URN.
     */
    urn: string;

    /**
     * The type of Extension Point being defined from a supported list.  This list will increase over time.
     */
    type: string;

    /**
     * The name of the Extension Point, intended for display in extension management interfaces.
     */
    name: string;

    /**
     * An overview of the Extension Point, intended for display in extension management interfaces.
     */
    description: string;

    /**
     * The name of thee component which will be registered.
     */
    component?: string;

    /**
     * The name of the module which will be registerd in the top-nav-level area.
     */
    module?: string;

    /**
     * The route on which only top level extrension points will be registerd.
     */
    route?: string;
}

export interface ExtensionPointDefinitions {
    [extPointType: string]: ExtensionPointDefinition;
}

export interface ExtensionPointDefinition {
    template: {
        name: TEMPLATE_TYPE;
    };
    schematicSteps: ((options: Schema) => Rule)[];
};

export type TEMPLATE_TYPE = "entity-action-extension-point" | "module-extension-point" | "view-extension-point";