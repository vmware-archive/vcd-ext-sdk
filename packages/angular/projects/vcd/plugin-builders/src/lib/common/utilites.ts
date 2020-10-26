import * as fs from 'fs';
import * as path from 'path';
import { LibrariesConfig, LibraryConfigScopeTypes, LibraryConfigScopes, ExtensionManifest, BasePluginBuilderSchema } from "./interfaces";

export const VCD_CUSTOM_LIB_SEPARATOR = ":";

/**
 * Convert string defined regex to regex object.
 */
export function extractExternalRegExps(externalLibs: string[] = []) {
	return externalLibs.map((libStr) => new RegExp(libStr))
}

export function takePackageNameFromPath(path: string) {
	// get the name. E.g. node_modules/packageName/not/this/part.js
	// or node_modules/packageName
	const result: string[] = path.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);

	if (!result.length) {
		return;
	}

	let packageName: string = result[1];

	if (packageName.startsWith("@")) {
		const name = /[\\/]node_modules[\\/](.*?)([\\/])(.*?)([\\/])|$/.exec(path)[0].split("/node_modules/")[1];
		packageName = name.substr(0, name.length - 1);
	}

	return packageName;
}

/**
 * Search for package json file
 */
export function takeChunkPackageJson(chunk: any, defaultBasePath: string, librariesConfig: LibrariesConfig) {
	const packageName = takePackageNameFromPath(chunk.context as string);
	const packageJsonPath = path.join(librariesConfig[packageName].context || defaultBasePath, "node_modules", packageName, "package.json");

	return JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
}

/**
 * This function in combination with webpack optimization.splitChunks.cacheGroups.[funcName]
 * will split all the vendors in named chunks per library. The name of the chunk will contain
 * the library name and version.
 * @param module Node Module
 * @param defaultBasePath Project Root
 */
export function splitVendorsIntoChunks(module: any, defaultBasePath: string, librariesConfig, vendorTracker?: (packageName: string) => any) {
	const packageJson = takeChunkPackageJson(module, defaultBasePath, librariesConfig);

	let packageJsonName: string = packageJson.name;
	// This is needed because otherwise webpack will create dir with subdirs
	if (packageJsonName.includes("/")) {
		packageJsonName = packageJsonName.replace("/", VCD_CUSTOM_LIB_SEPARATOR);
	}

	const packageName = `${packageJsonName}@${packageJson.version}`;

	if (vendorTracker) {
		vendorTracker(packageName);
	}

	return packageName;
}

export function processManifestJsonFile(
	librariesConfig: LibrariesConfig,
	libsBundles: Map<string, string>,
	jsonpFunction: string
) {
	return function (content, absolutePath) {
		if (!absolutePath.includes("manifest.json")) {
			return content;
		}
	
		const manifest: ExtensionManifest = JSON.parse(content.toString("utf-8"));
		manifest.externals = {};
		manifest.externals.libs = {};
		manifest.externals.jsonpFunction = jsonpFunction;

		Object.keys(librariesConfig).forEach((libName) => {
			const version = librariesConfig[libName].version;
			const preDefinedLocation = librariesConfig[libName].location;
			const location = libsBundles.get(`${libName}@${version}`);
			const scope: LibraryConfigScopeTypes = librariesConfig[libName].scope;

			if (!version || !version.length) {
				throw Error(`${libName} has incorrect version defined! Current version ${version}`)
			}

			if (!scope || LibraryConfigScopes.indexOf(scope) === -1) {
				throw Error(`${libName} with version ${version} has incorrect scope defined! Current scope ${scope}.`)
			}

			if (!preDefinedLocation && (!location || !location.length)) {
				throw Error(`${libName} with version ${version} was not found in the list of built vendor bundles. Please make sure you passed the correct lib name and version in your angular.json builder config section.`);
			}

			manifest.externals.libs[libName] = {
				version,
				scope,
				location: preDefinedLocation || location.replace("/", VCD_CUSTOM_LIB_SEPARATOR),
			};
		});

		return Buffer.from(JSON.stringify(manifest, null, 4));
	}
}

/**
 * Filter the node_modules and extract
 * those which has to be bundled with the plugin.
 */
export function filterRuntimeModules(options: BasePluginBuilderSchema) {
	return function(mod) {
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
	};
}

/**
 * Name the result bundles after the filtering phase.
 */
export function nameVendorFile(config: any, options: BasePluginBuilderSchema, pluginLibsBundles: Map<string, string>) {
	return function(module) {
		return splitVendorsIntoChunks(module, config.context, options.librariesConfig, (packageName: string) => {
			packageName = packageName.replace(VCD_CUSTOM_LIB_SEPARATOR, "/");
			pluginLibsBundles.set(packageName, `${packageName}.bundle.js`)
		});
	};
}