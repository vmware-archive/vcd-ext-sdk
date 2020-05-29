import { Rule, SchematicContext, Tree, chain, noop, SchematicsException } from '@angular-devkit/schematics';
import {
  getWorkspace,
} from '@schematics/angular/utility/config';
import { WorkspaceSchema, WorkspaceProject } from "@schematics/angular/utility/workspace-models";
import {
  getAppModulePath,
} from '@schematics/angular/utility/ng-ast-utils';
import {
  addImportToModule, addProviderToModule,
} from '@schematics/angular/utility/ast-utils';
import {
  InsertChange, Change,
} from '@schematics/angular/utility/change';
import { Schema } from './schema';
import * as ts from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";

export function ngAdd(options: Schema): Rule {
  return chain([
    options && (options.skipModuleImport || !options.moduleName) ? noop() : addModuleToImports(options),
  ]);
}

function addModuleToImports(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      (options.project ? options.project : Object.keys(workspace['projects'])[0]) as string
    );
    const {moduleName} = options;

    if (options.importInModule && options.importInModule.length) {
      addModuleImportTo(host, moduleName, '@vcd/sdk', options.importInModule);
    } else {
      addModuleImportToRootModule(host, moduleName, '@vcd/sdk', project);
    }

    context.logger.log('info', `✅️ "${moduleName}" is imported`);
    context.logger.log('info', `✅️ VcdApiClient is imported`);

    return host;
  };
}

/**
 * Finds the specified project configuration in the workspace. Throws an error if the project
 * couldn't be found.
 */
function getProjectFromWorkspace(workspace: WorkspaceSchema, projectName?: string): WorkspaceProject {
  const project = workspace.projects[projectName || workspace.defaultProject!];

  if (!project) {
    throw new SchematicsException(`Could not find project in workspace: ${projectName}`);
  }

  return project as WorkspaceProject;
}

/** Import and add module to root app module. */
function addModuleImportToRootModule(host: Tree, moduleName: string, src: string, project: WorkspaceProject) {
  const modulePath = getAppModulePath(host, getProjectMainFile(project));
  addModuleImportToModule(host, modulePath, moduleName, src);
}

/** Import and add module to selected module. */
function addModuleImportTo(host: Tree, moduleName: string, src: string, pathToModule: string) {
  addModuleImportToModule(host, pathToModule, moduleName, src);
}

/** Looks for the main TypeScript file in the given project and returns its path. */
function getProjectMainFile(project: WorkspaceProject): string {
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions.main) {
    throw new SchematicsException(
      `Could not find the project main file inside of the ` + `workspace config (${project.sourceRoot})`
    );
  }

  return buildOptions.main;
}

/** Resolves the architect options for the build target of the given project. */
function getProjectTargetOptions(project: WorkspaceProject, buildTarget: string) {
  if (project.targets && project.targets[buildTarget] && project.targets[buildTarget].options) {
    return project.targets[buildTarget].options;
  }

  if (project.architect && project.architect[buildTarget] && project.architect[buildTarget].options) {
    return project.architect[buildTarget].options;
  }

  throw new SchematicsException(`Cannot determine project target configuration for: ${buildTarget}.`);
}

/**
 * Import and add module to specific module path.
 * @param host the tree we are updating
 * @param modulePath src location of the module to import
 * @param moduleName name of module to import
 * @param src src location to import
 */
function addModuleImportToModule(host: Tree, modulePath: string, moduleName: string, src: string) {
  const moduleSource = getSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes: Change[] = [];
  changes.push(...addImportToModule(<any>moduleSource, modulePath, moduleName, src));
  changes.push(...addProviderToModule(<any>moduleSource, '@vcd/sdk', 'VcdApiClient', src));
  const recorder = host.beginUpdate(modulePath);

  changes.forEach((change: any) => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  host.commitUpdate(recorder);
}

/** Reads file given path and returns TypeScript source file. */
function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }
  return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}

