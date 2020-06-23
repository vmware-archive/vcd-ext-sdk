// Angular builder
import { executeBrowserBuilder } from '@angular-devkit/build-angular';
import { buildBrowserWebpackConfigFromContext } from '@angular-devkit/build-angular/src/browser';
import * as fs from 'fs';
import * as path from 'path';
// Builder bootstrap dependencies
import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { NormalizedBrowserBuilderSchema } from '@angular-devkit/build-angular/src/utils/normalize-builder-schema';
import * as ZipPlugin from 'zip-webpack-plugin';

interface Options extends NormalizedBrowserBuilderSchema {
  /**
   * A string of the form `path/to/file#exportName` that acts as a path to include to bundle
   */
  modulePath: string;
}

export default createBuilder(commandBuilder as () => Promise<BuilderOutput>);

async function commandBuilder(
  options: Options,
  context: BuilderContext,
  ): Promise<BuilderOutput> {
    // Build webpack configurtion
    const configs = await buildBrowserWebpackConfigFromContext(options, context);

    // Get the configuration
    const config = configs.config[0];

    // Make sure we are producing a single bundle
    delete config.entry.polyfills;
    delete config.optimization.runtimeChunk;
    delete config.optimization.splitChunks;
    delete config.entry.styles;
    delete config.entry["polyfills-es5"];

    // List the external libraries which will be provided by vcd
    config.externals = [
      /^rxjs(\/.+)?$/,
      /^@angular\/.+$/,
      /^@clr\/.+$/,
      /^@ngrx\/.+$/,
      /^@vcd\/common$/,
      /^@vcd-ui\/common$/,
      {
        'clarity-angular': 'clarity-angular',
        reselect: 'reselect'
      }
    ];

    // preserve path to entry point
    // so that we can clear use it within `run` method to clear that file
    const entryPointPath = config.entry.main[0];

    // Patch the main.ts file to point to the plugin which will be compiled
    // tslint:disable-next-line:prefer-const
    let [modulePath, moduleName] = options.modulePath.split('#');
    modulePath = path.join(context.workspaceRoot, modulePath);
    const entryPointContents = `export * from '${modulePath.substr(0, modulePath.indexOf(".ts"))}';`;
    patchEntryPoint(entryPointPath, entryPointContents);

    config.output.filename = 'bundle.js';
    config.output.library = moduleName;
    config.output.libraryTarget = 'amd';

    if (!config.plugins || !config.plugins.length) {
      config.plugins = [];
    }

    // Get the angular compiler
    const ngCompilerPluginInstance = config.plugins.find(
      x => x.constructor && x.constructor.name === 'AngularCompilerPlugin'
    );
    if (ngCompilerPluginInstance) {
      ngCompilerPluginInstance._entryModule = modulePath;
    }

    // Zip the result
    config.plugins.push(
      new ZipPlugin({
        filename: 'plugin.zip',
        exclude: [/\.html$/]
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
    .then(() => {
      patchEntryPoint(entryPointPath, '');
      return Promise.resolve({ success: true });
    })
    .catch((e) => {
      console.error(e);
      patchEntryPoint(entryPointPath, '');
      context.logger.error(e);
      return Promise.reject({ success: false });
    });
}

function patchEntryPoint(entryPointPath: string, contents: string) {
  fs.writeFileSync(entryPointPath, contents);
}