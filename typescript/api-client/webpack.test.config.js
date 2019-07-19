// This is the webpack configuration used for karma.  It is a simplified version of
// webpack.dev.config.js.
const webpack = require("webpack");
const path = require("path");

module.exports = {
    // Enable webpack cache.  Not sure what this does, but it's free.
    cache: true,

    // Automatically resolve typescript first, then Javascript.
    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: "ts-loader"
            }
        ]
    },

    plugins: [
        // Needed for setting correct context.  This is magic that is required by Angular.
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, "src")
        ),

        // Skip the emitting phase whenever there are errors while compiling.
        new webpack.NoEmitOnErrorsPlugin(),

        // Show progress.
        new webpack.ProgressPlugin(),

        // Sourcemaps.
        new webpack.SourceMapDevToolPlugin({
            filename: null,
            moduleFilenameTemplate: "[resource-path]",
            fallbackModuleFilenameTemplate: "[resource-path]?[hash]",
            sourceRoot: "webpack:///",
            test: /\.(ts|js)($|\?)/i
        })

        // NOTE: WE DO NOT DO ANY CHUNKING!  If you do so the speed tanks to one file every 5 seconds as each test
        // is considered an entrypoint and is therefore considered for chunking!
    ]
};
