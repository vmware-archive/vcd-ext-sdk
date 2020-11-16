import { Schema } from "./schema";
import { Rule, chain } from "@angular-devkit/schematics";
import { EXTENSION_POINTS_DEFINITIONS } from "./extension-point-types.config";

export function newExtensionPoint(options: Schema): Rule {
    const definition = EXTENSION_POINTS_DEFINITIONS[options.type]

    return chain([
        ...definition.schematicSteps.map((step) => {
            return step.call(null, options);
        })
    ]);
}