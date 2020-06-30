import { Rule, SchematicContext, Tree, chain, SchematicsException } from '@angular-devkit/schematics';
import {
  getWorkspace, updateWorkspace,
} from '@schematics/angular/utility/config';
import { Schema } from './schema';

export function ngAdd(options: Schema): Rule {
  return chain([
    updateAngularJson(options),
  ]);
}

function updateAngularJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfig = getWorkspace(tree);

    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    if (!workspaceConfig.projects[options.projectName]) {
      throw new SchematicsException(`Could not find Angular Project with name ${options.projectName} in your workspace`); 
    }

    if (!workspaceConfig.projects[options.projectName].architect) {
      throw new SchematicsException('Could not find Angular architect configuration in your workspace');
    }

    (workspaceConfig.projects as any)[options.projectName].architect["builder-config-example"] = {
      "builder": "@vcd/plugin-builders:plugin-builder",
      "options": {
        "modulePath": "src/path/to/your/plugin/plugin-example.module.ts#PluginModuleName",
        "outputPath": "dist/",
        "index": "src/index.html",
        "main": "src/<CREATE_EMPTY_FILE>.ts",
        "polyfills": "src/polyfills.ts",
        "tsConfig": "src/tsconfig.app.json",
        "assets": [
          // Attention! Order matters, 1st you have to define the folder which contains your manifest json file.
          { "glob": "**/*", "input": "./src/path/to/your/assets/folder", "output": "/" }
        ],
        "optimization": true,
        "outputHashing": "all",
        "sourceMap": false,
        "extractCss": false,
        "namedChunks": false,
        "aot": false,
        "extractLicenses": false,
        "vendorChunk": false,
        "buildOptimizer": false
      }
    };

    return updateWorkspace(workspaceConfig)(tree, context as any) as any;
  }
}