import { Rule, SchematicContext, Tree, url, apply, template, mergeWith, chain, noop, SchematicsException, move } from '@angular-devkit/schematics';
import { Schema } from "./schema";
import { strings } from "@angular-devkit/core";
import {
  getWorkspace,
  updateWorkspace
} from '@schematics/angular/utility/config';
import { normalize } from "path";
import { getSourceFile } from "../utils";
import { getSourceNodes } from "@schematics/angular/utility/ast-utils";
import { SyntaxKind, SourceFile } from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";
import { Change, InsertChange } from "@schematics/angular/utility/change";

const PROJECT_NAME = "cloud-director-container";
const PLUGINS_CONTAINING_FOLDER = "src/plugins";

export function pluginSeed(options: Schema): Rule {
  return chain([
    createDirectoryAndFiles(options),
    isVulcan(options.vcdVersion) ? noop() : isWellingtonOrXendi(options.vcdVersion) ? updateAngularJson(options) : noop(),
    isVulcan(options.vcdVersion) ? noop() : isWellingtonOrXendi(options.vcdVersion) ? updatePluginRegistrations(options) : noop(),
  ]);
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function createDirectoryAndFiles(options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const { vcdVersion } = options;

    const sourceTemplates = url(`./templates/${vcdVersion}`);
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        ...strings
      }),
      move(normalize(PLUGINS_CONTAINING_FOLDER))
    ]);

    return mergeWith(sourceParametrizedTemplates);
  };
}

function updateAngularJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfig = getWorkspace(tree);

    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    if (!workspaceConfig.projects[PROJECT_NAME]) {
      throw new SchematicsException(`Could not find Angular Project with name ${PROJECT_NAME} in your workspace`); 
    }

    if (!workspaceConfig.projects[PROJECT_NAME].architect) {
      throw new SchematicsException('Could not find Angular architect configuration in your workspace');
    }

    let lazyModules: string[] = (workspaceConfig.projects as any)[PROJECT_NAME].architect.build.options.lazyModules;

    if (!lazyModules || !lazyModules.length) {
      lazyModules = [];
    }

    const moduleToAdd = `${PLUGINS_CONTAINING_FOLDER}/${options.name}/src/main/simple-plugin.module`;

    if (lazyModules.indexOf(moduleToAdd) === -1) {
      lazyModules.push(moduleToAdd);
    }

    (workspaceConfig.projects as any)[PROJECT_NAME].architect.build.options.lazyModules = lazyModules;

    return updateWorkspace(workspaceConfig)(tree, context as any) as any;
  }
}

function updatePluginRegistrations(options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const pluginConfig = getSourceFile(tree, `${PLUGINS_CONTAINING_FOLDER}/index.ts`);

    if (!pluginConfig) {
      throw new SchematicsException(`File not found: ${pluginConfig}`);
    }

    const changes: Change[] = [
      addNewPlugin(options.name, pluginConfig)
    ];
    
    const recorder = tree.beginUpdate(`${PLUGINS_CONTAINING_FOLDER}/index.ts`);

    changes.forEach((change: any) => {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    });

    tree.commitUpdate(recorder);

    return tree;
  }
}

function addNewPlugin(folderName: string, pluginConfig: SourceFile) {
  const arr = getSourceNodes(pluginConfig).filter((node) => {
    return node.kind === SyntaxKind.CloseBracketToken
  });

  const lastPluginItem = arr[arr.length - 1].getStart() - 1;

  return new InsertChange(
    `${PLUGINS_CONTAINING_FOLDER}/index.ts`,
    lastPluginItem,
    `\tnew PluginRegistration("src/plugins/${folderName}/src", "main/simple-plugin.module#SimplePluginModule", "Seed Plugin"),\n`)
}

function isVulcan(version: string) {
  return version === "9.1";
}

function isWellingtonOrXendi(version: string) {
  return version === "9.7" || version === "10.0";
}