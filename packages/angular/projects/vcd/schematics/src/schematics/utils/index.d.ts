import { Tree } from '@angular-devkit/schematics';
import { WorkspaceSchema, WorkspaceProject, ProjectType } from "@schematics/angular/utility/workspace-models";
import { Change } from '@schematics/angular/utility/change';
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
/**
 * Build a default project path for generating.
 * @param project The project which will have its default path generated.
 */
export declare function buildDefaultPath(project: WorkspaceProject<ProjectType>): string;
/**
 * Build a relative path from one file path to another file path.
 */
export declare function buildRelativePath(from: string, to: string): string;
/**
 * Reads and creates TS Source object from a relative file path
 */
export declare function readIntoSourceFile(host: Tree, filePath: string): ts.SourceFile;
export interface UpdateJsonFn<T> {
    (obj: T): T | void;
}
export declare function updateJsonFile<T>(host: Tree, path: string, callback: UpdateJsonFn<T>): Tree;
/**
 * Add Export `export * from fileName` if the export doesn't exit
 * already. Assumes fileToEdit can be resolved and accessed.
 * @param fileToEdit (file we want to add export to)
 * @param symbolName (item to export)
 * @param fileName (path to the file)
 * @param isDefault (if true, export follows style for importing default exports)
 * @return Change
 */
export declare function insertExport(source: ts.SourceFile, fileToEdit: string, fileName: string): Change;
