// This is the webpack configuration used for the dev server.
const webpack = require("webpack");
const path = require("path");
const Happypack = require('happypack');

// All paths are relative to the `content/core` directory
const basePath = path.resolve(__dirname);

// Create the configuration for the dev-server
module.exports = {
    // Enable webpack cache.  Not sure what this does, but it's free.
    cache: true,

    // Ensure everything is completely relative to the `content/core` directory.
    context: basePath,

    // Use the 'source-map' plugin if source-maps are enabled
    devtool: 'source-map',

    // Use the selected entry-points
    entry: {
        bundle: path.resolve(basePath, "src", "main", "index.ts")
    },

    // Declare everything the container provides as external
    externals: [
        /^rxjs(\/.+)?$/,
        /^@angular\/.+$/,
        /^@ngrx\/.+$/,
        {
          'clarity-angular': 'clarity-angular',
          'reselect': 'reselect'
        }
    ],

    // Write all bundles to `dist/[name].js` as a library
    output: {
        filename: "[name].js",
        libraryTarget: "amd",
        path: path.join(basePath, "dist")
    },

    // Automatically resolve typescript first, then Javascript.
    // Note - this does not affect the node_modules, as they are in the separate DLL.
    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            // Build typescript files, using a cache (really useful for subsequent builds).
            // Use the `tsconfig.json` settings.
            //
            // TS files are pre-processed by the `angular2-template-loader` which will inline
            // HTML and CSS for components.
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            useCache: true,
                            configFileName: path.join(basePath, "tsconfig.json")
                        }
                    },
                    "angular2-template-loader"
                ]
            },

            // Delegate CSS to Happypack.  See plugins section.
            {
                test: /\.css$/,
                use: 'happypack/loader?id=css'
            },

            // Delegate SCSS to Happypack.  See plugins section.
            {
                test: /\.scss$|\.sass$/,
                use: 'happypack/loader?id=scss'
            },

            // HTML files will become raw strings.
            {
                test: /\.html$/,
                loaders: ["raw-loader"]
            },

            // Fonts encountered by CSS will become files distributed with the project
            {
                test: /\.(ttf|eot|svg|woff|woff2)$/,
                loader: "file-loader?name=fonts/[name].[ext]"
            }
        ]
    },

    plugins: [
        // CSS happypack plugin.  Happypack multithreads the specified loader chain.
        new Happypack({
            id: "css",

            // Apply PostCSS (using an external config - HappyPack requires this) to any CSS file,
            // load it using the css-loader (which is a bit smarter than raw files), before
            // converting it to a string for inclusion in the components directly.
            // Sourcemaps are enabled optionally based on the env variable above.
            loaders: [
                "exports-loader?module.exports.toString()",
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: true,
                        importLoaders: 1
                    }
                },
                {
                    loader: "postcss-loader",
                    options: {
                        ident: "postcss",
                        config: {
                            path: path.join(basePath, "config", "postcss.config.js")
                        }
                    }
                }
            ]
        }),

        // SCSS happypack plugin.  Happypack multithreads the specified loader chain.
        new Happypack({
            id: "scss",

            // Apply SASS compiling, then feed the resulting CSS into PostCSS (using an
            // external config - HappyPack requires this) to any SCSS/SASS file.
            // Then load this output CSS using the css-loader (which is a bit smarter than raw files),
            // before converting it to a string for inclusion in the components directly.
            // Sourcemaps are enabled optionally based on the env variable above.
            loaders: [
                "exports-loader?module.exports.toString()",
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: true,
                        importLoaders: 1
                    }
                },
                {
                    loader: "postcss-loader",
                    options: {
                        ident: "postcss",
                        config: {
                            path: path.join(basePath, "config", "postcss.config.js")
                        }
                    }
                },
                {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true,
                        precision: 8,
                        includePaths: []
                    }
                }
            ]
        }),

        // Needed for setting correct context.  This is magic that is required by Angular.
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(basePath, "src")
        ),

        // Skip the emitting phase whenever there are errors while compiling.
        new webpack.NoEmitOnErrorsPlugin(),

        // Show progress.
        new webpack.ProgressPlugin()
    ],

    optimization: {
        minimize: false, // <---- disables uglify.
    }
}
