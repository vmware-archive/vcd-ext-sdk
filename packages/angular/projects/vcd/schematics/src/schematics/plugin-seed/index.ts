import {
    Rule,
    SchematicContext,
    Tree,
    url, apply, template, mergeWith, chain, noop, SchematicsException, move, FileEntry
} from '@angular-devkit/schematics';
import { Schema } from './schema';
import { strings } from '@angular-devkit/core';
import {
    getWorkspace,
    updateWorkspace
} from '@schematics/angular/utility/config';
import { normalize } from 'path';
import { getSourceFile } from '../utils';
import { getSourceNodes } from '@schematics/angular/utility/ast-utils';
import { SyntaxKind, SourceFile } from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

const PROJECT_NAME = 'cloud-director-container';
const PLUGINS_CONTAINING_FOLDER = 'src/plugins';

export function pluginSeed(options: Schema): Rule {
    return chain([
        createDirectoryAndFiles(options),
        isVulcan(options.vcdVersion) ? noop() : isWellingtonOrXendi(options.vcdVersion) ? updateAngularJson(options) : noop(),
        isVulcan(options.vcdVersion) ? noop() : isWellingtonOrXendi(options.vcdVersion) ? updatePluginRegistrations(options) : noop(),
        isVulcan(options.vcdVersion) ? noop() : isWellingtonOrXendi(options.vcdVersion) ? installPluginBuilders(options) : noop(),
    ]);
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function createDirectoryAndFiles(options: Schema): Rule {
    return (_: Tree, __: SchematicContext) => {
        const { vcdVersion } = options;
        let temp = vcdVersion;
        if (isWellingtonOrXendi(vcdVersion)) {
            temp = 'wellington-xendi';
        }

        const sourceTemplates = url(`./templates/${temp}`);
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

export function updateAngularJson(options: Schema): Rule {
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

        const moduleToAdd = `${getUIPluginMainFolderPath(strings.dasherize(options.name))}/${dasherizeModuleFileName(options.module)}`;

        if (lazyModules.indexOf(moduleToAdd) === -1) {
            lazyModules.push(moduleToAdd);
        }

        (workspaceConfig.projects as any)[PROJECT_NAME].architect.build.options.lazyModules = lazyModules;

        return updateWorkspace(workspaceConfig)(tree, context as any) as any;
    };
}

export function updatePluginRegistrations(options: Schema): Rule {
    return (tree: Tree, _: SchematicContext) => {
        const pluginConfig = getSourceFile(tree, `${PLUGINS_CONTAINING_FOLDER}/index.ts`);

        if (!pluginConfig) {
            throw new SchematicsException(`File not found: ${pluginConfig}`);
        }

        const changes: Change[] = [
            addNewPlugin(options, pluginConfig)
        ];

        const recorder = tree.beginUpdate(`${PLUGINS_CONTAINING_FOLDER}/index.ts`);

        changes.forEach((change: any) => {
            if (change instanceof InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        });

        tree.commitUpdate(recorder);

        return tree;
    };
}

export function addNewPlugin(options: Schema, pluginConfig: SourceFile) {
    const arr = getSourceNodes(pluginConfig).filter((node) => {
        return node.kind === SyntaxKind.CloseBracketToken;
    });

    const lastPluginItem = arr[arr.length - 1].getStart() - 1;

    return new InsertChange(
        `${PLUGINS_CONTAINING_FOLDER}/index.ts`,
        lastPluginItem,
        // tslint:disable-next-line: max-line-length
        `\tnew PluginRegistration("src/plugins/${strings.dasherize(options.name)}/src", "main/${dasherizeModuleFileName(options.module)}#${classifyModulName(options.module)}", "${strings.classify(options.name)}"),\n`);
}

export function installPluginBuilders(options: Schema): Rule {
    return chain([
        // Install @vcd/plugin-builders
        (tree: Tree, context: SchematicContext) => {
            const packageJsonRaw = tree.get('./package.json');

            const installTask = triggerInstallTask(packageJsonRaw, options, context);

            context.addTask(new RunSchematicTask('@vcd/plugin-builders', 'ng-add', {
                projectName: PROJECT_NAME,
                pluginName: strings.dasherize(options.name),
                // tslint:disable-next-line: max-line-length
                pluginMainFolderPath: `${getUIPluginMainFolderPath(strings.dasherize(options.name))}/${dasherizeModuleFileName(options.module)}.ts#${classifyModulName(options.module)}`,
                pluginPublicFolderPath: `./${getUIPluginPublicFolderPath(strings.dasherize(options.name))}`,
            }), installTask ? [installTask] : []);

            return tree;
        },
    ]);
}

export function triggerInstallTask(packageJsonRaw: FileEntry | null, options: Schema, context: SchematicContext) {
    let packageJson: {
        dependencies?: {
            [dep: string]: string;
        };
        devDependencies?: {
            [dep: string]: string;
        }
    } = {};

    if (packageJsonRaw) {
        packageJson = JSON.parse(packageJsonRaw.content.toString('utf-8'));
    }

    if (packageJson.dependencies) {
        if (packageJson.dependencies['@vcd/plugin-builders'] &&
            packageJson.dependencies['@vcd/plugin-builders'].includes(options.pluginBuildersVersion)) {
            return;
        }
    }

    if (packageJson.devDependencies) {
        if (packageJson.devDependencies['@vcd/plugin-builders'] &&
            packageJson.devDependencies['@vcd/plugin-builders'].includes(options.pluginBuildersVersion)) {
            return;
        }
    }

    return context.addTask(new NodePackageInstallTask({
        packageManager: 'npm',
        packageName: `@vcd/plugin-builders@${options.pluginBuildersVersion}`,
        quiet: false,
    }));
}

export function isVulcan(version: string) {
    return version === '9.1';
}

export function isWellingtonOrXendi(version: string) {
    return version === '9.7' || version === '10.0';
}

export function getUIPluginMainFolderPath(pluginName: string) {
    return `${PLUGINS_CONTAINING_FOLDER}/${pluginName}/src/main`;
}

export function getUIPluginPublicFolderPath(pluginName: string) {
    return `${PLUGINS_CONTAINING_FOLDER}/${pluginName}/src/public`;
}

export function dasherizeModuleFileName(moduleName: string) {
    return `${strings.dasherize(moduleName)}.module`;
}

export function classifyModulName(moduleName: string) {
    return `${strings.classify(moduleName)}Module`;
}
