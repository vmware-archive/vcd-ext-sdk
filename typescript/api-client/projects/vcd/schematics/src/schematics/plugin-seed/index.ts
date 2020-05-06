import { Rule, SchematicContext, Tree, url, apply, template, mergeWith } from '@angular-devkit/schematics';
import { Schema } from "./schema";
import { strings } from "@angular-devkit/core";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function pluginSeed(_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const { vcdVersion } = _options;

    const sourceTemplates = url(`./templates/${vcdVersion}`);
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings
      })
    ]);

    return mergeWith(sourceParametrizedTemplates);
  };
}
