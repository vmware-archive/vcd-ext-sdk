import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { BrowserBuilderOptions, executeBrowserBuilder, ExecutionTransformer } from '@angular-devkit/build-angular';
import { json } from '@angular-devkit/core';
import { Configuration } from "webpack";
import * as webpack from "webpack";
import { BasePluginBuilderSchema, ExtensionManifest, PrecalculateRemOptions } from "../common/interfaces";
import { normalize, logging, Path } from '@angular-devkit/core';
import { VCD_CUSTOM_LIB_SEPARATOR, extractExternalRegExps, filterRuntimeModules, nameVendorFile } from "../common/utilites";
import * as path from "path";
import * as fs from "fs";
import * as postcssPreCalculateRem from '../common/postcss-precalculate-rem';
import { ConcatWebpackPlugin } from "../common/concat";
import * as ZipPlugin from 'zip-webpack-plugin';
import * as CopyPlugin from "copy-webpack-plugin";
import { AssetPatternClass } from "@angular-devkit/build-angular/src/builders/browser/schema";
import { finalize } from "rxjs/operators";

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

export type PluginBuilderSchema7X = BrowserBuilderOptions & BasePluginBuilderSchema;

export const customWebpackConfigTransformFactory: (
    options: PluginBuilderSchema7X,
    context: BuilderContext
) => ExecutionTransformer<Configuration> =
    (options, { workspaceRoot, target, logger }) =>
        browserWebpackConfig => {
            return CustomWebpackBuilder.buildWebpackConfig(
                normalize(workspaceRoot),
                browserWebpackConfig,
                options,
                logger
            );
        };

export const getTransforms = (options: PluginBuilderSchema7X, context: BuilderContext) => ({
    webpackConfiguration: customWebpackConfigTransformFactory(options, context),
});

export const buildCustomWebpackBrowser = (
    options: PluginBuilderSchema7X,
    context: BuilderContext
): ReturnType<typeof executeBrowserBuilder> => {
    const entryPointPath = path.join(context.workspaceRoot, options.main);
    const entryPointOriginalContent = fs.readFileSync(entryPointPath, 'utf-8');

    const manifestJsonPath = path.join(context.workspaceRoot, "/src/public/", 'manifest.json');
    const manifestOriginalContent = fs.readFileSync(manifestJsonPath, 'utf-8');

    return executeBrowserBuilder(options, context, getTransforms(options, context)).pipe(
        finalize(() => {
            // Reset files to original state
            patchFile(entryPointPath, entryPointOriginalContent);
            patchFile(manifestJsonPath, manifestOriginalContent);
        }),
    );
};

export default createBuilder<json.JsonObject & PluginBuilderSchema7X>(
    buildCustomWebpackBrowser
);

export class CustomWebpackBuilder {
    static buildWebpackConfig(
        root: Path,
        config: Configuration,
        options: PluginBuilderSchema7X,
        logger: logging.LoggerApi
    ): Configuration {
        if (!config) {
            throw Error('No webpack config found!');
        }

        if (!options.modulePath) {
            throw Error('Please define modulePath!');
        }

        const pluginLibsBundles = new Map<string, string>();

        /**
         * If you are using something like node.fs: 'empty' replace it with resolve.fallback.fs: false.
         * https://webpack.js.org/migrate/5/
         */
        config.resolve.fallback = {
            fs: false
        };

        // Make sure we are producing a single bundle
        delete config.entry['polyfills'];
        delete config.optimization.runtimeChunk;
        delete config.optimization.splitChunks;
    
        if (!options.precalculateRem) {
            delete config.entry['styles'];
        }
    
        // List the external libraries which will be provided by vcd
        config.externals = [
            ...(options.ignoreDefaultExternals ? [] : defaultExternals.common),
            ...(!options.enableRuntimeDependecyManagement && !options.ignoreDefaultExternals ? defaultExternals['9.7-10.0'] : []),
            ...extractExternalRegExps(options.externalLibs),
        ];

        // preserve path to entry point
        // so that we can clear use it within `run` method to clear that file
        const entryPointPath = config.entry['main'][0];

        // Load manifest file
        const manifestJsonPath = path.join(`${config.context}/src/public`, 'manifest.json');
        const manifest: ExtensionManifest = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf-8'));
        
        // Patch the main.ts file to point to the plugin which will be compiled
        let [modulePath, moduleName] = options.modulePath.split('#');

        if (options.enableRuntimeDependecyManagement) {
            // Create unique jsonpFunction name
            config.output.uniqueName = `vcdJsonp#${moduleName}#${manifest.urn}`;

            // Configure the vendor chunks
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    // Generate js file per vender for those whcih will be shared
                    vendor: {
                        test: filterRuntimeModules(options),
                        name: nameVendorFile(config, options, pluginLibsBundles, manifest, manifestJsonPath),
                        enforce: true,
                    },
                    // All other vendors go in common.js file
                    common: {
                        test: (mod: webpack.Module) => {
                            if (!mod.context) {
                                return false;
                            }

                            if (!Object.keys(options.librariesConfig).some((key) => {
                                    return mod.context.includes(key);
                                })) {
                                return true;
                            }
                            return false;
                        },
                        name: "common",
                        reuseExistingChunk: true,
                        enforce: true,
                    }
                }
            };
        }

        // Export the plugin module
        modulePath = modulePath.substr(0, modulePath.indexOf('.ts'));
        const entryPointContents = `export * from '${modulePath}';`;

        if (!options.preserveMainFile) {
            patchFile(entryPointPath, entryPointContents);
        }

        // Define amd lib
        const outputUnprefixedFileNames = options.enableRuntimeDependecyManagement;
        config.output.filename = outputUnprefixedFileNames ? '[name].js' : 'bundle.js';
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

        if (options.concatGeneratedFiles) {
            config.plugins.push(
                new ConcatWebpackPlugin({
                    concat: options.concatGeneratedFiles,
                    manifest,
                    manifestJsonPath,
                })
            );
        }

        if (options.replaceGlobalVarUsage) {
            config.plugins.push(
                new webpack.DefinePlugin(options.replaceGlobalVarUsage)
            );
        }

        /**
         * Angular doesn't use webpack plugin to emit assets and therefore the ZipPlugin
         * has no access to these resources so it can add them to the final Zip.
         * 
         * Here we add the Webpack's CopyPlugin so it emits the assets using
         * Webpack's mechanics and ZipPlugin has access to these files.
         */
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: `${(options.assets[0] as AssetPatternClass).glob}`,
                        to: `.${(options.assets[0] as AssetPatternClass).output}`,
                        context: `${(options.assets[0] as AssetPatternClass).input}`
                    }
                ]
            })
        );

        // Exclude all already concatenated files from plugin zip
        const excludeConcatenatedFiles: string[] = [];
        if (options.concatGeneratedFiles) {
            options.concatGeneratedFiles.forEach((concatPair) => {
                concatPair.inputs.forEach((inputFileName: string) => {
                    if (concatPair.output === inputFileName) {
                        return;
                    }

                    excludeConcatenatedFiles.push(inputFileName);
                });
            });
        }

        // Zip the result
        config.plugins.push(
            new ZipPlugin({
                filename: 'plugin.zip',
                exclude: [,
                    ...Object.keys(options.librariesConfig)
                        .filter((key) => {
                            return options.librariesConfig[key].scope === 'external';
                        })
                        .map((key) => {
                            const libBundleName = `${key.replace('/', VCD_CUSTOM_LIB_SEPARATOR)}@${options.librariesConfig[key].version}.js`;
                            return libBundleName;
                        }),
                    ...excludeConcatenatedFiles
                ]
            }),
        );
        
        return config;
    }
}

function patchFile(entryPointPath: string, contents: string) {
    fs.writeFileSync(entryPointPath, contents);
}

export const PRE_CALCULATE_REM_OPTIONS: PrecalculateRemOptions = {
    rootValue: 16,
    propList: ['*'],
    replace: true,
    minRemValue: 0,
    replaceRootWithHost: true
};

function registerPrecalculateRem(config: Configuration, precalculateRemOptions: PrecalculateRemOptions) {
    /**
     * Adding precalculateRemOptions PostCSS plugin only to the css rule for the
     * Global Style CSS files seem to be applied automatically to the SCSS and SASS rules
     * for global files.
     * 
     * Global Style file is like style.scss on the other side there is ngResource type
     * of files that are actually the CSS files of each individual component.
     */ 
    const cssRule: webpack.RuleSetRule = (config.module.rules as any[]).find((rule: webpack.RuleSetRule) => {
        if (!rule) {
            return;
        }

        if (!rule.test) {
            return;
        }

        return rule.test.toString() === "/\\.(?:css)$/i";
    });
    
    const globalStylesPreProcessor = cssRule.rules[0].oneOf.find((rule) => {
        return rule.resourceQuery.toString() === "/\\?ngGlobalStyle/";
    });
    const ruleSet: webpack.RuleSetUseItem[] = globalStylesPreProcessor.use as webpack.RuleSetUseItem[];
    ruleSet.push({
        loader: require.resolve('postcss-loader'),
        options: {
            implementation: require('postcss'),
            sourceMap: false,
            postcssOptions: {
                plugins: [
                    postcssPreCalculateRem.postCssPlugin(precalculateRemOptions),
                ]
            },
        },
    });
}

function generatePrecalculateRemOptions(precalculateRemOptions: PrecalculateRemOptions, manifest: ExtensionManifest) {
    if (!precalculateRemOptions) {
        precalculateRemOptions = {};
    }

    let remScalerName: string = manifest.urn;
    // Remove all ":" symbols because they are invalid for CSS var name.
    while (remScalerName.includes(":")) {
        remScalerName = remScalerName.replace(":", '-');
    }

    return {
        ...PRE_CALCULATE_REM_OPTIONS,
        ...precalculateRemOptions,
        remScalerName: remScalerName
    };
}
