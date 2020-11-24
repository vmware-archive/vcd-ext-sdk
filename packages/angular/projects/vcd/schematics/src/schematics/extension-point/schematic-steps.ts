import { Schema } from './schema';
import { updateJsonFile, buildDefaultPath, readIntoSourceFile, buildRelativePath, insertExport, getSourceFile } from '../utils';
import { Rule, template, move, mergeWith, apply, url, Tree, SchematicContext, SchematicsException } from '@angular-devkit/schematics';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/config';
import { EXTENSION_POINTS_DEFINITIONS } from './extension-point-types.config';
import { strings } from '@angular-devkit/core';
import { normalize } from 'path';
import { dasherize, classify } from '@angular-devkit/core/src/utils/strings';
import {
    addDeclarationToModule,
    addExportToModule,
    addEntryComponentToModule,
    getSourceNodes
} from '@schematics/angular/utility/ast-utils';
import { InsertChange, Change } from '@schematics/angular/utility/change';
import { ExtensionPointManifest, Manifest } from './interfaces';
import { SyntaxKind, SourceFile } from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export function createExtensionPointFiles(options: Schema): Rule {
    return (host: Tree) => {
        const workspace = getWorkspace(host);
        const project = workspace.projects[options.project as string];

        if (!options.mainModuleSrcPath && project) {
            options.mainModuleSrcPath = buildDefaultPath(project);
        }

        const definition = EXTENSION_POINTS_DEFINITIONS[options.type];

        const sourceTemplates = url(`./templates/${definition.template.name}`);
        const sourceParametrizedTemplates = apply(sourceTemplates, [
            template({
                ...options,
                ...strings
            }),
            move(normalize(`${options.mainModuleSrcPath}/main/${dasherize(options.name)}`))
        ]);

        return mergeWith(sourceParametrizedTemplates);
    };
}

export function importExtensionPointComponentToModule(options: Schema): Rule {
    return (host: Tree) => {
        if (!options.mainModuleFileName || !options.mainModuleSrcPath) {
            return host;
        }

        const pathToMainModule = normalize(`${options.mainModuleSrcPath}/main/${options.mainModuleFileName}`);

        // Add to declarations
        let source = readIntoSourceFile(host, pathToMainModule);

        const componentPath = absComponentPath(options);
        const modulePath = absMainModulePath(options);
        const relativePath = buildRelativePath(modulePath, componentPath);
        const relativeMainModulePath = `${options.mainModuleSrcPath}/main/${options.mainModuleFileName}`;

        const classifiedName = `${strings.classify(options.name)}Component`;
        const declarationChanges = addDeclarationToModule(
            source,
            relativeMainModulePath,
            classifiedName,
            relativePath
        );

        const declarationRecorder = host.beginUpdate(relativeMainModulePath);
        for (const change of declarationChanges) {
            if (change instanceof InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(declarationRecorder);


        // Add to exports
        // Need to refresh the AST because we overwrote the file in the host.
        source = readIntoSourceFile(host, relativeMainModulePath);
        const exportRecorder = host.beginUpdate(relativeMainModulePath);
        const exportChanges = addExportToModule(source, relativeMainModulePath, classifiedName, relativePath);

        for (const change of exportChanges) {
            if (change instanceof InsertChange) {
                exportRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(exportRecorder);


        // Add to entry components
        // Need to refresh the AST because we overwrote the file in the host.
        source = readIntoSourceFile(host, relativeMainModulePath);
        const entryComponentRecorder = host.beginUpdate(relativeMainModulePath);
        // tslint:disable-next-line: deprecation
        const entryComponentChanges = addEntryComponentToModule(source, relativeMainModulePath, classifiedName, relativePath);

        for (const change of entryComponentChanges) {
            if (change instanceof InsertChange) {
                entryComponentRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(entryComponentRecorder);
    };
}

export function addExports(options: Schema): Rule {
    return (host: Tree) => {
        if (!options.mainModuleSrcPath || !options.mainModuleFileName) {
            return host;
        }

        const componentPath = absComponentPath(options);
        const modulePath = absMainModulePath(options);
        const relativePath = buildRelativePath(modulePath, componentPath);
        const relativeMainModulePath = `${options.mainModuleSrcPath}/main/${options.mainModuleFileName}`;

        // Add exports * from created extension point file
        const source = readIntoSourceFile(host, relativeMainModulePath);
        const mainFileRecorder = host.beginUpdate(relativeMainModulePath);
        const changes = [insertExport(source, relativeMainModulePath, relativePath)];
        for (const change of changes) {
            if (change instanceof InsertChange) {
                mainFileRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(mainFileRecorder);

        return host;
    };
}

export function addExportsForPrimary(options: Schema): Rule {
    return (host: Tree) => {
        if (!options.mainModuleSrcPath || !options.mainModuleFileName) {
            return host;
        }

        const componentPath = absModulePath(options);
        const modulePath = absMainModulePath(options);
        const relativePath = buildRelativePath(modulePath, componentPath);
        const relativeMainModulePath = `${options.mainModuleSrcPath}/main/${options.mainModuleFileName}`;

        // Add exports * from created extension point file
        const source = readIntoSourceFile(host, relativeMainModulePath);
        const mainFileRecorder = host.beginUpdate(relativeMainModulePath);
        const changes = [insertExport(source, relativeMainModulePath, relativePath)];
        for (const change of changes) {
            if (change instanceof InsertChange) {
                mainFileRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(mainFileRecorder);

        return host;
    };
}

export function updateUiPluginManifest(options: Schema): Rule {
    return (host: Tree) => {
        if (!options.mainModuleSrcPath) {
            return host;
        }

        return updateJsonFile(host, normalize(`${options.mainModuleSrcPath}/public/manifest.json`), (manifest: Manifest) => {
            mainifstExtensionPointsSafeGuard(manifest);
            patchContainerVersion(manifest);

            const extPoint: ExtensionPointManifest = {
                urn: options.urn,
                type: options.type as string,
                name: options.name,
                description: options.description,
            };

            extPoint.component = `${classify(options.name)}Component`;

            manifest.extensionPoints.push(extPoint);
        });
    };
}

export function updateUiPluginManifestForPrimary(options: Schema) {
    return (host: Tree) => {
        if (!options.mainModuleSrcPath) {
            return host;
        }

        return updateJsonFile(host, normalize(`${options.mainModuleSrcPath}/public/manifest.json`), (manifest: Manifest) => {
            mainifstExtensionPointsSafeGuard(manifest);
            patchContainerVersion(manifest);

            const extPoint: ExtensionPointManifest = {
                urn: options.urn,
                type: options.type as string,
                name: options.name,
                description: options.description,
            };

            extPoint.module = `${classify(options.name)}Module`;
            extPoint.route = `${dasherize(options.name)}-route`;

            manifest.extensionPoints.push(extPoint);
        });
    };
}

export function updateAngularJson(options: Schema) {
    return (host: Tree, context: SchematicContext) => {
        if (!options.mainModuleSrcPath) {
            return host;
        }

        const workspaceConfig = getWorkspace(host);

        if (!workspaceConfig) {
            throw new SchematicsException('Could not find Angular workspace configuration');
        }

        if (!options.project || !workspaceConfig.projects[options.project]) {
            throw new SchematicsException(`Could not find Angular Project with name ${options.project} in your workspace`);
        }

        if (!workspaceConfig.projects[options.project].architect) {
            throw new SchematicsException('Could not find Angular architect configuration in your workspace');
        }

        let lazyModules: string[] = (workspaceConfig.projects as any)[options.project].architect.build.options.lazyModules;

        if (!lazyModules || !lazyModules.length) {
            lazyModules = [];
        }

        const moduleToAdd = normalize(
            `${options.mainModuleSrcPath.replace('./', '')}` +
            '/main/' +
            `${dasherize(options.name)}/${dasherize(options.name)}.module`
        );

        if (lazyModules.indexOf(moduleToAdd) === -1) {
            lazyModules.push(moduleToAdd);
        }

        (workspaceConfig.projects as any)[options.project].architect.build.options.lazyModules = lazyModules;

        return updateWorkspace(workspaceConfig)(host, context as any) as any;
    };
}

export function updatePluginRegistrations(options: Schema) {
    return (host: Tree) => {
        if (!options.mainModuleSrcPath) {
            return host;
        }

        const pluginConfig = getSourceFile(host, `src/plugins/index.ts`);

        if (!pluginConfig) {
            throw new SchematicsException(`File not found: ${pluginConfig}`);
        }

        const changes: Change[] = [
            addNewPlugin(options, pluginConfig)
        ];

        const recorder = host.beginUpdate(`src/plugins/index.ts`);

        changes.forEach((change: any) => {
            if (change instanceof InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        });

        host.commitUpdate(recorder);

        return host;
    };
}

function addNewPlugin(options: Schema, pluginConfig: SourceFile) {
    const arr = getSourceNodes(pluginConfig).filter((node) => {
      return node.kind === SyntaxKind.CloseBracketToken;
    });

    const lastPluginItem = arr[arr.length - 1].getStart() - 1;

    return new InsertChange(
      `src/plugins/index.ts`,
      lastPluginItem,
      // tslint:disable-next-line: max-line-length
      `\tnew PluginRegistration("${(options.mainModuleSrcPath as string).replace('./', '')}", "main/${dasherize(options.name)}/${dasherize(options.name)}.module#${strings.classify(options.name)}Module", "${strings.classify(options.name)}"),\n`);
}

// Common Functions
function mainifstExtensionPointsSafeGuard(manifest: Manifest) {
    if (!manifest.extensionPoints || !manifest.extensionPoints.length) {
        manifest.extensionPoints = [];
    }
}

function patchContainerVersion(manifest: Manifest) {
    // VCD Platform supports extension points only for container version 9.5.0
    if (manifest.containerVersion !== '9.5.0') {
        manifest.containerVersion = '9.5.0';
    }
}

function absMainModulePath(options: Schema) {
    return normalize(`${(options.mainModuleSrcPath as string).replace('.', '/')}/main/${options.mainModuleFileName}`);
}

function absComponentPath(options: Schema) {
    return normalize(
        (options.mainModuleSrcPath as string).replace('.', '/') +
        `/main/${dasherize(options.name)}/${dasherize(options.name)}.component`
    );
}

function absModulePath(options: Schema) {
    return normalize(
        (options.mainModuleSrcPath as string).replace('.', '/') +
        `/main/${dasherize(options.name)}/${dasherize(options.name)}.module`
    );
}
