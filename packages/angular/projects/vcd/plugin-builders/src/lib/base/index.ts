/**
 * This new version of the builder shims the basics which
 * has to be covered in future, additinal work is expected.
 * Most of the functionallity which has to be implemented here is
 * well described in the base plugin builder.
 */

// Angular builder
// Builder bootstrap dependencies
import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { executeBrowserBuilder } from '@angular-devkit/build-angular';
import { buildBrowserWebpackConfigFromContext } from '@angular-devkit/build-angular/src/browser';
import { NormalizedBrowserBuilderSchema } from '@angular-devkit/build-angular/src/utils/normalize-builder-schema';
import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';
import * as ZipPlugin from 'zip-webpack-plugin';
import { ConcatWebpackPlugin } from '../common/concat';
import { BasePluginBuilderSchema, ExtensionManifest, PrecalculateRemOptions } from '../common/interfaces';
import {
    extractExternalRegExps,
    filterRuntimeModules,
    nameVendorFile,
    VCD_CUSTOM_LIB_SEPARATOR
} from '../common/utilites';
import * as postcssPreCalculateRem from '../common/postcss-precalculate-rem';

export interface PluginBuilderSchema7X extends NormalizedBrowserBuilderSchema, BasePluginBuilderSchema { }

export const defaultExternals = {
    common: [
        /^@angular\/.+$/,
        /^@ngrx\/.+$/,
        /^@vcd\/common$/,
        /^@vcd-ui\/common$/,
        {
            reselect: 'reselect'
        }
    ],
    ['9.7-10.0']: [
        /^rxjs(\/.+)?$/,
        /^@clr\/.+$/,
        {
            'clarity-angular': 'clarity-angular',
        }
    ]
};

export const PRE_CALCULATE_REM_OPTIONS: PrecalculateRemOptions = {
    rootValue: 16,
    propList: ['*'],
    replace: true,
    minRemValue: 0,
    replaceRootWithHost: true
};

export default createBuilder(commandBuilder as () => Promise<BuilderOutput>);

async function commandBuilder(
    options: PluginBuilderSchema7X,
    context: BuilderContext,
): Promise<BuilderOutput> {
    if (!options.modulePath) {
        throw Error('Please define modulePath!');
    }

    // Build webpack configurtion
    const configs = await buildBrowserWebpackConfigFromContext(options, context);
    const pluginLibsBundles = new Map<string, string>();

    // Get the configuration
    const config = configs.config[0] || configs.config as webpack.Configuration;

    // Make sure we are producing a single bundle
    delete config.entry['polyfills'];
    delete config.optimization.runtimeChunk;
    delete config.optimization.splitChunks;

    if (!options.precalculateRem) {
        delete config.entry['styles'];
    }

    delete config.entry['polyfills-es5'];

    // List the external libraries which will be provided by vcd
    config.externals = [
        ...(options.ignoreDefaultExternals ? [] : defaultExternals.common),
        ...(!options.enableRuntimeDependecyManagement && !options.ignoreDefaultExternals ? defaultExternals['9.7-10.0'] : []),
        ...extractExternalRegExps(options.externalLibs),
    ];

    // preserve path to entry point
    // so that we can clear use it within `run` method to clear that file
    const entryPointPath = config.entry['main'][0];
    const entryPointOriginalContent = fs.readFileSync(entryPointPath, 'utf-8');

    // Load manifest file
    const copyPlugin = config.plugins.find((x) => x && x['patterns']);
    const manifestJsonPath = path.join(copyPlugin['patterns'][0].context, 'manifest.json');
    const manifest: ExtensionManifest = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf-8'));
    const manifestOriginalContent: string = fs.readFileSync(manifestJsonPath, 'utf-8');

    // Patch the main.ts file to point to the plugin which will be compiled
    // tslint:disable-next-line:prefer-const
    let [modulePath, moduleName] = options.modulePath.split('#');

    if (options.enableRuntimeDependecyManagement) {
        // Create unique jsonpFunction name
        config.output.jsonpFunction = `vcdJsonp#${moduleName}#${manifest.urn}`;

        // Configure the vendor chunks
        config.optimization.splitChunks = {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: filterRuntimeModules(options),
                    name: nameVendorFile(config, options, pluginLibsBundles, manifest, manifestJsonPath),
                },
            },
        };
    }

    // Export the plugin module
    modulePath = modulePath.substr(0, modulePath.indexOf('.ts'));
    const entryPointContents = `export * from '${modulePath}';`;

    if (!options.preserveMainFile) {
        patchFile(entryPointPath, entryPointContents);
    }

    // Define amd lib
    config.output.filename = '[name].js';
    config.output.library = moduleName;
    config.output.libraryTarget = 'amd';
    // workaround to support bundle on nodejs
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;

    if (!config.plugins || !config.plugins.length) {
        config.plugins = [];
    }

    if (options.precalculateRem) {
        // Generate precalcuate rem post css plugin's options
        const precalculateRemOptions = generatePrecalculateRemOptions(options.precalculateRemOptions, manifest);
        // Save base px size in the manifest
        manifest.pluginBasePx = precalculateRemOptions.rootValue;
        // Register the post css plugin
        registerPrecalculateRem(config, precalculateRemOptions);
    }

    // Get the angular compiler
    const ngCompilerPluginInstance = config.plugins.find(
        x => x.constructor && x.constructor.name === 'AngularCompilerPlugin'
    );
    if (ngCompilerPluginInstance) {
        if (options.forceDisableIvy) {
            ngCompilerPluginInstance['_compilerOptions'].enableIvy = false;
        }
        ngCompilerPluginInstance['_entryModule'] = `${modulePath}#${moduleName}`;
    }

    if (options.concatGeneratedFiles) {
        config.plugins.push(
            new ConcatWebpackPlugin({
                concat: options.concatGeneratedFiles
            })
        );
    }

    // Zip the result
    config.plugins.push(
        new ZipPlugin({
            filename: 'plugin.zip',
            exclude: [
                /\.html$/,
                ...Object.keys(options.librariesConfig)
                    .filter((key) => {
                        return options.librariesConfig[key].scope === 'external';
                    })
                    .map((key) => {
                        const libBundleName = `${key.replace('/', VCD_CUSTOM_LIB_SEPARATOR)}@${options.librariesConfig[key].version}.js`;
                        return libBundleName;
                    })
            ]
        }),
    );

    options.fileReplacements = options.fileReplacements && options.fileReplacements.length ? options.fileReplacements : [];
    options.styles = options.styles && options.styles.length ? options.styles : [];
    options.scripts = options.scripts && options.scripts.length ? options.scripts : [];

    // Trigger the angular browser builder
    return executeBrowserBuilder(options, context, {
      webpackConfiguration: () => (config)
    })
    .toPromise()
    .then((result) => {
        patchFile(entryPointPath, entryPointOriginalContent);
        patchFile(manifestJsonPath, manifestOriginalContent);

        if (!result) {
            return Promise.reject({ success: false, info: `Something went wrong with ${__dirname}` });
        }

        return Promise.resolve(result);
    })
    .catch((e) => {
        console.error(e);
        patchFile(entryPointPath, entryPointOriginalContent);
        patchFile(manifestJsonPath, manifestOriginalContent);
        context.logger.error(e);
        return Promise.reject({ success: false });
    });
}

function patchFile(entryPointPath: string, contents: string) {
    fs.writeFileSync(entryPointPath, contents);
}

function registerPrecalculateRem(config: webpack.Configuration, precalculateRemOptions: PrecalculateRemOptions) {
    const precalculateRem = postcssPreCalculateRem.postCssPlugin(
        precalculateRemOptions,
    );

    const cssPostCssConfigs = config.module.rules.filter((rule) => {
        return rule.test.toString() === "/\\.css$/" || rule.test.toString() === "/\\.scss$|\\.sass$/";
    });

    for (let i = 0; i < cssPostCssConfigs.length; i++) {
        const cssPostCssConfig = cssPostCssConfigs[i];

        const cssPostCssLoader: webpack.RuleSetUse = (cssPostCssConfig.use as webpack.RuleSetUse[]).find((useRule: { loader: string }) => {
            if (!(useRule).loader) {
                return false;
            }
            return useRule.loader.includes("postcss-loader");
        });
        const postcssPluginCreator = (cssPostCssLoader as { options: any }).options.plugins;
        const postCssPlugins = (cssPostCssLoader as { options: any }).options.plugins = [];

        postCssPlugins.push(postcssPluginCreator);
        postCssPlugins.push(precalculateRem);
    }
}

function generatePrecalculateRemOptions(precalculateRemOptions: PrecalculateRemOptions, manifest: ExtensionManifest) {
    if (!precalculateRemOptions) {
        precalculateRemOptions = {};
    }

    return {
        ...PRE_CALCULATE_REM_OPTIONS,
        ...precalculateRemOptions,
        remScalerName: manifest.urn.replace(":", "-")
    }
}