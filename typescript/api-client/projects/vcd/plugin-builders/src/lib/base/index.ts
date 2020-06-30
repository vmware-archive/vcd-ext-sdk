import * as fs from 'fs';
import * as path from "path";
import * as ZipPlugin from 'zip-webpack-plugin';
import {
  BrowserBuilder,
  NormalizedBrowserBuilderSchema
} from '@angular-devkit/build-angular';
import { Path, virtualFs } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { BuilderConfiguration, BuildEvent } from '@angular-devkit/architect';
import { tap } from 'rxjs/operators';
import { extractExternalRegExps, splitVendorsIntoChunks, processManifestJsonFile, VCD_CUSTOM_LIB_SEPARATOR, takeChunkPackageJson } from "./utilites";
import { LibrariesConfig, ExtensionManifest } from "./interfaces";
import { ConcatWebpackPlugin } from "./concat";

export interface PluginBuilderSchema extends NormalizedBrowserBuilderSchema {
	vcdVersion: string;
  /**
   * A string of the form `path/to/file#exportName`
	 * that acts as a path to include to bundle.
   */
	modulePath: string;
	/**
	 * List of external libraries defined by the user.
	 */
	externalLibs: string[];
	/**
	 * Will disable the default external libraries,
	 * allowing the user to define his own thanks to externalLibs property.
	 */
	ignoreDefaultExternals: boolean;
	/**
	 * List of libraries determining thier version, scope and file name (location). 
	 */
	librariesConfig: LibrariesConfig;
}

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
	["9.7-10.0"]: [
		/^rxjs(\/.+)?$/,
		/^@clr\/.+$/,
		{
			'clarity-angular': 'clarity-angular',
		}
	]
}

export default class PluginBuilder extends BrowserBuilder {
  	private options: PluginBuilderSchema;

  	private entryPointPath: string;
	private entryPointOriginalContent: string;
	private pluginLibsBundles = new Map<string, string>();

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

		// Reset the default configurations
		delete config.entry.polyfills;
		delete config.optimization.runtimeChunk;
		delete config.optimization.splitChunks;
		delete config.entry.styles;
		delete config.entry["polyfills-es5"];

		// List the external libraries which will be provided by vcd
		config.externals = [
			...(options.ignoreDefaultExternals ? [] : defaultExternals.common),
			...(options.vcdVersion !== "10.2" && !options.ignoreDefaultExternals ? defaultExternals["9.7-10.0"] : []),
			...extractExternalRegExps(options.externalLibs),
		];

		let [modulePath, moduleName] = this.options.modulePath.split('#');

		if (options.vcdVersion === "10.2") {
			const self = this;

			// Create unique jsonpFunction name
			const copyPlugin = config.plugins.find((x) => x && x.copyWebpackPluginPatterns);
			const manifestJsonPath = path.join(copyPlugin.copyWebpackPluginPatterns[0].context, "manifest.json");
			const manifest: ExtensionManifest = JSON.parse(fs.readFileSync(manifestJsonPath, "utf-8"));
			config.output.jsonpFunction = `vcdJsonp#${moduleName}#${manifest.urn}`;

			// Configure the vendor chunks
			config.optimization.splitChunks = {
				chunks: "all",
				cacheGroups: {
					vendor: {
						test(mod) {
							if (!mod.context) {
								return false;
							}
						
							// Only node_modules are needed and these which are defiend in the librariesConfig
							if (
								!mod.context.includes('node_modules') ||
								!Object.keys(options.librariesConfig).some((key) => {
									return mod.context.includes(key)
								})
							) {
								return false;
							}

							return true;
						},
						name(module) {
							return splitVendorsIntoChunks(module, config.context, (packageName: string) => {
								packageName = packageName.replace(VCD_CUSTOM_LIB_SEPARATOR, "/");
								self.pluginLibsBundles.set(packageName, `${packageName}.bundle.js`)
							});
						},
					},
				},
			};

			// Transform manifest json file.
			copyPlugin.copyWebpackPluginPatterns[0].transform = processManifestJsonFile(
				options.librariesConfig || {},
				this.pluginLibsBundles,
				config.output.jsonpFunction
			);
		}

		// preserve path to entry point
		// so that we can clear use it within `run` method to clear that file
		this.entryPointPath = config.entry.main[0];
		this.entryPointOriginalContent = fs.readFileSync(this.entryPointPath, "utf-8");
			
		// Export the plugin module
		modulePath = modulePath.substr(0, modulePath.indexOf(".ts"));
		const entryPointContents = `export * from '${modulePath}';`;
		this.patchEntryPoint(entryPointContents);

		// Define amd lib
		config.output.filename = `bundle.js`;
		config.output.library = moduleName;
		config.output.libraryTarget = 'amd';
		// workaround to support bundle on nodejs
		config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;

		// Reset angular compiler entry module, in order to compile our plugin.
		const ngCompilerPluginInstance = config.plugins.find(
			x => x.constructor && x.constructor.name === 'AngularCompilerPlugin'
		);

		if (ngCompilerPluginInstance) {
			ngCompilerPluginInstance._entryModule = modulePath;
		}

		if (options.vcdVersion === "10.2") {
			config.plugins.push(
				new ConcatWebpackPlugin({
					concat: [
						{
							inputs: [
								"bundle.js",
								"vendors~main.bundle.js"
							],
							output: "bundle.js"
						}
					]
				})
			);
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
			
		// To avoid writing it in my scripts every time keep it here
		builderConfig.options.deleteOutputPath = false;

		return super.run(builderConfig).pipe(
			tap(() => {
				// clear entry point so our main.ts (or any other entry file) to remain untouched.
				this.patchEntryPoint(this.entryPointOriginalContent);
			})
		);
	}
}