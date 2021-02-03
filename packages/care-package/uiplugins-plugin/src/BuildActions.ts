import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { debug } from 'debug';

import { AbstractBuildActions } from '@vcd/care-package-plugin-abstract';
import { BuildActionParameters, DeployActions, ElementSource } from '@vcd/care-package-def';
import * as Generator from 'yeoman-generator';
import { DEFAULT_ENV_CONTENT, DEFAULT_PROXY_CONTENT, emulatorDeps } from './Constants';
import { DeployActions as UIPluginDeployActions } from './DeployActions';
import { names } from './names';

const log = debug('vcd:ext:care-package:uiPlugins-plugin');

export class BuildActions extends AbstractBuildActions {
    name = names.name;

    getDeployActions(): DeployActions {
        return new UIPluginDeployActions();
    }

    getDefaultOutDir(): string {
        return 'dist';
    }
    getDefaultFiles(): string {
        return '*.zip';
    }
    getSrcRoot(): string {
        return path.join(__dirname, '..', 'templates');
    }

    generate(generator: Generator, answers: any) {
        super.generate(generator, answers);
        generator.sourceRoot(this.getSrcRoot());
        generator.fs.copyTpl(
            generator.templatePath('emulator'),
            generator.destinationPath(),
            answers,
            undefined,
            { globOptions: { dot: true } });
        generator.fs.extendJSON(generator.destinationPath('package.json'), emulatorDeps);
    }


    private loadJsonConfig(rootDir: string, name: string) {
        const jsonPath = path.resolve(rootDir, name);
        if (!fs.existsSync(jsonPath)) {
            return null;
        }
        const fileContent = fs.readFileSync(jsonPath).toString();
        return JSON.parse(fileContent);
    }

    private storeJsonConfig(rootDir: string, name: string, content: any) {
        const jsonPath = path.resolve(rootDir, name);
        fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2));
    }

    private discoverPluginModule(packageRoot: string, element: ElementSource) {
        const base = element.location?.base || path.join('packages', element.name);
        const baseAbs = path.join(packageRoot, base);
        const angularJson = this.loadJsonConfig(baseAbs, 'angular.json');
        const modulePath = angularJson.projects[angularJson.defaultProject].architect.build.options.modulePath;
        const modulePathTokens = modulePath.split(path.sep);
        const fileAndModule = modulePathTokens.slice(1).join(path.sep);
        let file = fileAndModule.split('#')[0];
        if (file.includes('.ts')) {
            file = file.split('.').slice(0, -1).join('.');
        }
        const module = fileAndModule.split('#')[1];
        const srcRoot = path.join(base, 'src');
        return {
            srcRoot,
            file,
            module
        };
    }

    async serve({ packageRoot, elements, options }: BuildActionParameters) {
        const config = options.config;
        const rootDir = path.join(packageRoot, '.env'); // Extract as optional parameter?
        const angularJson = this.loadJsonConfig(packageRoot, 'angular.json');
        const tsconfigJson = this.loadJsonConfig(packageRoot, 'tsconfig.emulator.json');
        const environmnet = this.loadJsonConfig(rootDir, 'environment.json') || DEFAULT_ENV_CONTENT;
        const proxyConfig = this.loadJsonConfig(rootDir, 'proxy.conf.json') || DEFAULT_PROXY_CONTENT;
        let pluginsConfig = [];
        try {
            log('Setting auth token');
            environmnet.credentials = {
                token: `Bearer ${config.token}`
            };
            log('Updating proxy config');
            Object.keys(proxyConfig).forEach(key => {
                proxyConfig[key].target = new URL(config.basePath).origin;
            });
            log('Updating Plugins');
            const pluginModules = elements.map(element => this.discoverPluginModule(packageRoot, element));
            pluginsConfig = pluginModules.map(pm => {
                return {
                    label: pm.module,
                    root: pm.srcRoot,
                    module: `${pm.file}#${pm.module}`
                };
            });
            log('Updating angular.json');
            angularJson.projects.emulator.architect.build.options.assets = [
                'node_modules/@vcd/ui-emulator/src/favicon.ico',
                ...pluginModules.map(pm => {
                    return {
                        glob: '**/*',
                        input: `./${pm.srcRoot}/public`,
                        output: `/${pm.srcRoot}/public`
                    };
                })
            ];
            angularJson.projects.emulator.architect.build.options.lazyModules = pluginModules.map(pm => path.join(pm.srcRoot, pm.file));
            log('Updating tsconfig.emulator.json');
            tsconfigJson.include = [
                '.env/*.json',
                'node_modules/@vcd/ui-emulator/src/**/*.ts',
                ...pluginModules.map(pm => path.join(pm.srcRoot, '**', '*.ts'))
            ];
        } catch (e) {
            log('Error configuring environment.', e);
        } finally {
            this.storeJsonConfig(rootDir, 'environment.runtime.json', environmnet);
            this.storeJsonConfig(rootDir, 'proxy.conf.runtime.json', proxyConfig);
            this.storeJsonConfig(rootDir, 'plugins.json', pluginsConfig);
            this.storeJsonConfig(packageRoot, 'angular.json', angularJson);
            this.storeJsonConfig(packageRoot, 'tsconfig.emulator.json', tsconfigJson);
        }
        spawn('npm', ['run', 'ng:serve'], {
            cwd: packageRoot,
            stdio: 'inherit'
        });
        return Promise.resolve();
    }
}
