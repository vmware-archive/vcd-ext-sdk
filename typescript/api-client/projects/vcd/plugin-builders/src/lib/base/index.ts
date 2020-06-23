import {
  BrowserBuilder,
  NormalizedBrowserBuilderSchema
} from '@angular-devkit/build-angular';
import { Path, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
import { Observable } from 'rxjs';

import { BuilderConfiguration, BuildEvent } from '@angular-devkit/architect';
import { tap } from 'rxjs/operators';
import * as ZipPlugin from 'zip-webpack-plugin';

interface PluginBuilderSchema extends NormalizedBrowserBuilderSchema {
  /**
   * A string of the form `path/to/file#exportName` that acts as a path to include to bundle
   */
  modulePath: string;
}
export default class PluginBuilder extends BrowserBuilder {
  private options: PluginBuilderSchema;

  private entryPointPath: string;

  constructor(context) {
    super(context);
  }

  patchEntryPoint(contents: string) {
    fs.writeFileSync(this.entryPointPath, contents);
  }

  buildWebpackConfig(
    root: Path,
    projectRoot: Path,
    host: virtualFs.Host<fs.Stats>,
    options: PluginBuilderSchema
  ) {
    if (!this.options.modulePath) {
      throw Error('Please define modulePath!');
    }

    const config = super.buildWebpackConfig(root, projectRoot, host, options);

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
    this.entryPointPath = config.entry.main[0];
    let [modulePath, moduleName] = this.options.modulePath.split('#');
    modulePath = modulePath.substr(0, modulePath.indexOf(".ts"));
    const entryPointContents = `export * from '${modulePath}';`;
    this.patchEntryPoint(entryPointContents);

    config.output.filename = `bundle.js`;
    config.output.library = moduleName;
    config.output.libraryTarget = 'amd';
    // workaround to support bundle on nodejs
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;

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

    return config;
  }

  run(
    builderConfig: BuilderConfiguration<PluginBuilderSchema>
  ): Observable<BuildEvent> {
    this.options = builderConfig.options;
    this.options.fileReplacements = this.options.fileReplacements && this.options.fileReplacements.length ? this.options.fileReplacements : [];
    this.options.styles = this.options.styles && this.options.styles.length ? this.options.styles : [];
    this.options.scripts = this.options.scripts && this.options.scripts.length ? this.options.scripts : [];
    // I don't want to write it in my scripts every time so I keep it here
    builderConfig.options.deleteOutputPath = false;

    return super.run(builderConfig).pipe(
      tap(() => {
        // clear entry point so our main.ts is always empty
        this.patchEntryPoint('');
      })
    );
  }
}