import { RawSource } from 'webpack-sources';

export interface ConcatWebpackPluginOptions {
    concat: {
        inputs: string[],
        output: string,
    }[];
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
    apply(compiler) {
        // Hook for on emit
        compiler.hooks.emit.tapAsync('vCloud Director Concat Plugin', (
            compilation,
            callback
        ) => {
            if (compilation.compiler.isChild()) {
                callback();
                return;
            }

            // Cocnat files
            this.options.concat
                .map((obj) => {
                    // Take sources which has to concatenated
                    const sourcesToConcat = obj.inputs.map((input) => {
                        const source = compilation.assets[input].source();
                        delete compilation.assets[input];
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
                    compilation.assets[asset.output] = new RawSource(asset.source as any);
                });

            callback();
        });
    }
}
