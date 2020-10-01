import { Rule, SchematicContext, Tree, chain, SchematicsException } from '@angular-devkit/schematics';
import {
  getWorkspace, updateWorkspace,
} from '@schematics/angular/utility/config';
import { Schema } from './schema';
import { strings } from "@angular-devkit/core";

export function ngAdd(options: Schema): Rule {
  return chain([
    updateAngularJson(options),
  ]);
}

export function updateAngularJson(options: Schema): Rule {
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

    (workspaceConfig.projects as any)[options.projectName].architect[`${parsePluginName(options.pluginName)}-builder`] = {
      "builder": "@vcd/plugin-builders:plugin-builder",
      "options": {
        "modulePath": `${options.pluginMainFolderPath}`,
        "outputPath": "dist/",
        "index": "src/index.html",
        "main": "src/plugins.main.ts",
        "tsConfig": "src/tsconfig.app.json",
        "assets": [
          { "glob": "**/*", "input": `${options.pluginPublicFolderPath}`, "output": "/" }
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

    context.logger.info(`✅️ Builder Configured! Run "ng run ${options.projectName}:${parsePluginName(options.pluginName)}-builder" to build your UI Plugin!`);
    return updateWorkspace(workspaceConfig)(tree, context as any) as any;
  }
}

export function parsePluginName(name: string) {
  return strings.dasherize(name);
}