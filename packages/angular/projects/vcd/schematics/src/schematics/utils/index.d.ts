import { Tree } from '@angular-devkit/schematics';
import { WorkspaceSchema, WorkspaceProject } from "@schematics/angular/utility/workspace-models";
import ts = require("@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript");
/**
 * Finds the specified project configuration in the workspace. Throws an error if the project
 * couldn't be found.
 */
export declare function getProjectFromWorkspace(workspace: WorkspaceSchema, projectName?: string): WorkspaceProject;
/** Import and add module to root app module. */
export declare function addModuleImportToRootModule(host: Tree, moduleName: string, src: string, project: WorkspaceProject): void;
/** Import and add module to selected module. */
export declare function addModuleImportTo(host: Tree, moduleName: string, src: string, pathToModule: string): void;
/** Looks for the main TypeScript file in the given project and returns its path. */
export declare function getProjectMainFile(project: WorkspaceProject): string;
/** Resolves the architect options for the build target of the given project. */
export declare function getProjectTargetOptions(project: WorkspaceProject, buildTarget: string): any;
/**
 * Import and add module to specific module path.
 * @param host the tree we are updating
 * @param modulePath src location of the module to import
 * @param moduleName name of module to import
 * @param src src location to import
 */
export declare function addModuleImportToModule(host: Tree, modulePath: string, moduleName: string, src: string): void;
/** Reads file given path and returns TypeScript source file. */
export declare function getSourceFile(host: Tree, path: string): ts.SourceFile;
