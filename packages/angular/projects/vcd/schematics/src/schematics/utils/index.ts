import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { WorkspaceSchema, WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';
import {
    getAppModulePath,
} from '@schematics/angular/utility/ng-ast-utils';
import {
    addImportToModule, findNodes, insertAfterLastOccurrence,
} from '@schematics/angular/utility/ast-utils';
import {
    InsertChange, Change
} from '@schematics/angular/utility/change';
import ts = require('@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript');
import { normalize, relative, parseJson, JsonParseMode } from '@angular-devkit/core';

/**
 * Finds the specified project configuration in the workspace. Throws an error if the project
 * couldn't be found.
 */
export function getProjectFromWorkspace(workspace: WorkspaceSchema, projectName?: string): WorkspaceProject {
    // tslint:disable-next-line: no-non-null-assertion
    const project = workspace.projects[projectName || workspace.defaultProject!];

    if (!project) {
        throw new SchematicsException(`Could not find project in workspace: ${projectName}`);
    }

    return project as WorkspaceProject;
}

/** Import and add module to root app module. */
export function addModuleImportToRootModule(host: Tree, moduleName: string, src: string, project: WorkspaceProject) {
    const modulePath = getAppModulePath(host, getProjectMainFile(project));
    addModuleImportToModule(host, modulePath, moduleName, src);
}

/** Import and add module to selected module. */
export function addModuleImportTo(host: Tree, moduleName: string, src: string, pathToModule: string) {
    addModuleImportToModule(host, pathToModule, moduleName, src);
}

/** Looks for the main TypeScript file in the given project and returns its path. */
export function getProjectMainFile(project: WorkspaceProject): string {
    const buildOptions = getProjectTargetOptions(project, 'build');

    if (!buildOptions.main) {
        throw new SchematicsException(
            `Could not find the project main file inside of the ` + `workspace config (${project.sourceRoot})`
        );
    }

    return buildOptions.main;
}

/** Resolves the architect options for the build target of the given project. */
export function getProjectTargetOptions(project: WorkspaceProject, buildTarget: string) {
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
export function addModuleImportToModule(host: Tree, modulePath: string, moduleName: string, src: string) {
    const moduleSource = getSourceFile(host, modulePath);

    if (!moduleSource) {
        throw new SchematicsException(`Module not found: ${modulePath}`);
    }

    const changes = addImportToModule(moduleSource as any, modulePath, moduleName, src);
    const recorder = host.beginUpdate(modulePath);

    changes.forEach((change: any) => {
        if (change instanceof InsertChange) {
            recorder.insertLeft(change.pos, change.toAdd);
        }
    });

    host.commitUpdate(recorder);
}

/** Reads file given path and returns TypeScript source file. */
export function getSourceFile(host: Tree, path: string): ts.SourceFile {
    const buffer = host.read(path);
    if (!buffer) {
        throw new SchematicsException(`Could not find file for path: ${path}`);
    }
    return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}

/**
 * Build a default project path for generating.
 * @param project The project which will have its default path generated.
 */
export function buildDefaultPath(project: WorkspaceProject<ProjectType>): string {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    const projectDirName = project.projectType === ProjectType.Application ? 'app' : 'library';

    return `${root}${projectDirName}`;
}

/**
 * Build a relative path from one file path to another file path.
 */
export function buildRelativePath(from: string, to: string): string {
    from = normalize(from);
    to = normalize(to);

    // Convert to arrays.
    const fromParts = from.split('/');
    const toParts = to.split('/');

    // Remove file names (preserving destination)
    fromParts.pop();
    const toFileName = toParts.pop();

    const relativePath = relative(normalize(fromParts.join('/') || '/'),
        normalize(toParts.join('/') || '/'));
    let pathPrefix = '';

    // Set the path prefix for same dir or child dir, parent dir starts with `..`
    if (!relativePath) {
        pathPrefix = '.';
    } else if (!relativePath.startsWith('.')) {
        pathPrefix = `./`;
    }
    if (pathPrefix && !pathPrefix.endsWith('/')) {
        pathPrefix += '/';
    }

    return pathPrefix + (relativePath ? relativePath + '/' : '') + toFileName;
}

/**
 * Reads and creates TS Source object from a relative file path
 */
export function readIntoSourceFile(host: Tree, filePath: string): ts.SourceFile {
    const text = host.read(filePath);
    if (text === null) {
        throw new SchematicsException(`File ${filePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');

    return ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
}

export type UpdateJsonFn<T> = (obj: T) => T | void;

export function updateJsonFile<T>(host: Tree, path: string, callback: UpdateJsonFn<T>): Tree {
    const source = host.read(path);
    if (source) {
        const sourceText = source.toString('utf-8');
        const json = parseJson(sourceText, JsonParseMode.Strict);
        callback(json as {} as T);
        host.overwrite(path, JSON.stringify(json, null, 4));
    }

    return host;
}

/**
 * Add Export `export * from fileName` if the export doesn't exit
 * already. Assumes fileToEdit can be resolved and accessed.
 * @param fileToEdit (file we want to add export to)
 * @param fileName (path to the file)
 * @return Change
 */
export function insertExport(
    source: ts.SourceFile,
    fileToEdit: string,
    fileName: string
): Change {
    const rootNode = source;
    const allImports = findNodes(rootNode as any, ts.SyntaxKind.ImportDeclaration);

    // no such import declaration exists
    const useStrict = findNodes(rootNode as any, ts.isStringLiteral as any)
        .filter((n) => (n as any).text === 'use strict');
    let fallbackPos = 0;
    if (useStrict.length > 0) {
        fallbackPos = useStrict[0].end;
    }
    // if there are no imports or 'use strict' statement, insert import at beginning of file
    const toInsert = `;\nexport * from '${fileName}'`;

    return insertAfterLastOccurrence(
        allImports,
        toInsert,
        fileToEdit,
        fallbackPos,
        ts.SyntaxKind.StringLiteral,
    );
}
