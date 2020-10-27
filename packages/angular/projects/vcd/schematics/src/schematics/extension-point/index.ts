import { Schema } from "./schema";
import { Rule, chain, url, apply, template, move, mergeWith } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { strings } from "@angular-devkit/core";
import { normalize } from "path";
import { addDeclarationToModule, addEntryComponentToModule, addExportToModule } from "@schematics/angular/utility/ast-utils";
import { InsertChange } from "@schematics/angular/utility/change";
import { getWorkspace } from "@schematics/angular/utility/config";
import { buildDefaultPath, buildRelativePath, readIntoSourceFile, updateJsonFile, insertExport } from "../utils";
import { dasherize, classify } from "@angular-devkit/core/src/utils/strings";

export function newExtensionPoint(options: Schema): Rule {
    return chain([
        createExtensionPointFiles(options),
        importExtensionPointComponentToModule(options),
        updateUiPluginManifest(options),
        addExports(options),
    ]);
}

function createExtensionPointFiles(options: Schema): Rule {
    return (host: Tree) => {
        const workspace = getWorkspace(host);
        const project = workspace.projects[options.project as string];
        options.type = options.type ? options.type : "navigation:primary";

        if (!options.path && project) {
            options.path = buildDefaultPath(project);
        }
        
        const temp = isEntityAction(options) ? "entity-action-extension-point" :
            isPrimaryNav(options) ? "module-extension-point" : "view-extension-point";

        const sourceTemplates = url(`./templates/${temp}`);
        const sourceParametrizedTemplates = apply(sourceTemplates, [
            template({
                ...options,
                ...strings
            }),
            move(normalize(options.path as string))
        ]);

        return mergeWith(sourceParametrizedTemplates);
    }
}

function importExtensionPointComponentToModule(options: Schema): Rule {
    return (host: Tree) => {
        if (!options.uiPluginMainModulePath || isPrimaryNav(options)) {
            return host;
        }
        
        // Add to declarations
        let source = readIntoSourceFile(host, options.uiPluginMainModulePath);
        const componentPath = normalize(
            (options.path as string).replace(".", "/") +
            `/${dasherize(options.name)}.component`
        );
        const modulePath = normalize(options.uiPluginMainModulePath.replace(".", "/"));
        const relativePath = buildRelativePath(modulePath, componentPath);

        const classifiedName = `${strings.classify(options.name)}Component`;
        const declarationChanges = addDeclarationToModule(
            source,
            options.uiPluginMainModulePath,
            classifiedName,
            relativePath
        );
    
        const declarationRecorder = host.beginUpdate(options.uiPluginMainModulePath);
        for (const change of declarationChanges) {
            if (change instanceof InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(declarationRecorder);


        // Add to exports
        // Need to refresh the AST because we overwrote the file in the host.
        source = readIntoSourceFile(host, options.uiPluginMainModulePath);
        const exportRecorder = host.beginUpdate(options.uiPluginMainModulePath);
        const exportChanges = addExportToModule(source, options.uiPluginMainModulePath, classifiedName, relativePath);
    
        for (const change of exportChanges) {
            if (change instanceof InsertChange) {
                exportRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(exportRecorder);

        
        // Add to entry components
        // Need to refresh the AST because we overwrote the file in the host.
        source = readIntoSourceFile(host, options.uiPluginMainModulePath);
        const entryComponentRecorder = host.beginUpdate(options.uiPluginMainModulePath);
        const entryComponentChanges = addEntryComponentToModule(source, options.uiPluginMainModulePath, classifiedName, relativePath);
    
        for (const change of entryComponentChanges) {
            if (change instanceof InsertChange) {
                entryComponentRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(entryComponentRecorder);
    };
}

function addExports(options: Schema): Rule {
    return (host: Tree) => {
        if (!options.uiPluginMainModulePath) {
            return host;
        }

        const componentPath = normalize(
            (options.path as string).replace(".", "/") +
            `/${dasherize(options.name)}.${isPrimaryNav(options) ? 'module' : 'component'}`
        );
        const modulePath = normalize(options.uiPluginMainModulePath.replace(".", "/"));
        const relativePath = buildRelativePath(modulePath, componentPath);

        // Add exports * from created extension point file
        const source = readIntoSourceFile(host, options.uiPluginMainModulePath);
        const mainFileRecorder = host.beginUpdate(options.uiPluginMainModulePath);
        const changes = [insertExport(source, options.uiPluginMainModulePath, relativePath)]
        for (const change of changes) {
            if (change instanceof InsertChange) {
                mainFileRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(mainFileRecorder);

        return host
    }
}

function updateUiPluginManifest(options: Schema): Rule {
    return (host: Tree) => {
        if (!options.manifest) {
            return host;
        }

        return updateJsonFile(host, options.manifest, (manifest: Manifest) => {
            if (!manifest.extensionPoints || !manifest.extensionPoints.length) {
                manifest.extensionPoints = [];
            }

            if (manifest.containerVersion !== "9.1.0") {
                manifest.containerVersion = "9.5.0";
            }

            const extPoint: ExtensionPointManifest = {
                urn: options.urn,
                type: options.type as string,
                name: options.name,
                description: options.description,
            };

            if (isPrimaryNav(options)) {
                extPoint.module = `${classify(options.name)}Module`;
                extPoint.route = `${dasherize(options.name)}-route`;
            } else {
                extPoint.component = `${classify(options.name)}Component`;
            }

            manifest.extensionPoints.push(extPoint)
        });
    }
}

function isEntityAction(options: Schema) {
    return options.type === "vm-action" || options.type === "vapp-action";
}

function isPrimaryNav(options: Schema) {
    return options.type === "navigation:primary";
}

interface Manifest {
    containerVersion: string;
    extensionPoints: ExtensionPointManifest[];
}

/**
 * This defines a formal extension point.  An extension point is a declarative way for an extension manifest
 * to describe how the VCD application behaviour is extended or modified by the extension.
 */
interface ExtensionPointManifest {
    /**
     * Universally unique URN that identifies this Extension Point.  It is suggested to preprend the extension's URN.
     */
    urn: string;

    /**
     * The type of Extension Point being defined from a supported list.  This list will increase over time.
     */
    type: string;

    /**
     * The name of the Extension Point, intended for display in extension management interfaces.
     */
    name: string;

    /**
     * An overview of the Extension Point, intended for display in extension management interfaces.
     */
    description: string;

    /**
     * The name of thee component which will be registered.
     */
    component?: string;

    /**
     * The name of the module which will be registerd in the top-nav-level area.
     */
    module?: string;

    /**
     * The route on which only top level extrension points will be registerd.
     */
    route?: string;
}