import * as fs from 'fs';
import * as webpack from 'webpack';
import { ExtensionManifest } from './interfaces';

export interface ConcatWebpackPluginOptions {
    manifest: ExtensionManifest;
    manifestJsonPath: string;
    concat?: ConcatWebpackPluginOptionsEntries[];
}

export interface ConcatWebpackPluginOptionsEntries {
    inputs: string[];
    output: string;
}

/**
 * Webpack Plugin for Concatenation
 */
export class ConcatWebpackPlugin {
    private options: ConcatWebpackPluginOptions;

    constructor(options: ConcatWebpackPluginOptions) {
        this.options = options;
    }

    /**
     * Called by Webpack
     * @param compiler Webpack compiler
     * see https://webpack.js.org/api/compiler-hooks/ for more detials.
     */
    apply(compiler: webpack.Compiler) {
        compiler.hooks.thisCompilation.tap('vCloud Director Concat Plugin', (compilation, callback) => {
            const logger = compiler.getInfrastructureLogger(ConcatWebpackPlugin.name);
            logger.log(`${ConcatWebpackPlugin.name} started.`);

            compilation.hooks.processAssets.tapPromise(
				{
					name: ConcatWebpackPlugin.name,
					stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER,
				},
				() => new Promise((resolve, reject) => {
                    try {
                        this.concatFiles(compilation);
                        this.registerStylesAndScriptsInManifest(compilation);
                        resolve(null);
                    }
                    catch (e) {
                        logger.error(`${ConcatWebpackPlugin.name} failed.`);
                        reject(e);
                    }
                })
			);
        });
    }

    private concatFiles(compilation: webpack.Compilation) {
        if (!this.options.concat) {
            return;
        }

        // Cocnat files
        this.options.concat
        .map((obj) => {
            // Take sources which has to concatenated
            const sourcesToConcat = obj.inputs.map((input) => {
                const source = compilation.assets[input].source();
                return Buffer.isBuffer(source) ? source : new Buffer(source);
            });

            return {
                output: obj.output,
                sourcesToConcat
            };
        })
        .map((asset) => {
            return {
                output: asset.output,
                source: Buffer.concat(asset.sourcesToConcat),
            };
        })
        .forEach((asset) => {
            // Output the result
            (compilation as any).emitAsset(asset.output, new webpack.sources.RawSource(asset.source as any));
        });
    }

    private registerStylesAndScriptsInManifest(compilation: webpack.Compilation) {
        if (compilation.assets["common.css"]) {
            if (!this.options.manifest.extensionPoints[0].styles) {
                this.options.manifest.extensionPoints[0].styles = [];
            }

            if (this.options.manifest.extensionPoints[0].styles.indexOf("common.css") === -1) {
                this.options.manifest.extensionPoints[0].styles.push("common.css");
            }
        }

        if (compilation.assets["scripts.js"]) {
            if (!this.options.manifest.extensionPoints[0].scripts) {
                this.options.manifest.extensionPoints[0].scripts = [];
            }

            if (this.options.manifest.extensionPoints[0].scripts.indexOf("scripts.js") === -1) {
                this.options.manifest.extensionPoints[0].scripts.push("scripts.js");
            }
        }

        const manifest = JSON.stringify(this.options.manifest, null, 4);
        fs.writeFileSync(this.options.manifestJsonPath, manifest);
        // Add to compilation assets so other plugins relying on assets can access the lates version of the manifest
        compilation.assets["manifest.json"] = new webpack.sources.RawSource(Buffer.from(manifest, "utf-8") as any);
    }
}
