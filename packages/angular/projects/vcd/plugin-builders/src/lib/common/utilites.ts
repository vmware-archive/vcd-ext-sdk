import * as fs from 'fs';
import * as path from 'path';
import { BasePluginBuilderSchema, ExtensionManifest, LibrariesConfig, LibraryConfigScopes, LibraryConfigScopeTypes } from './interfaces';

export const VCD_CUSTOM_LIB_SEPARATOR = ':';

/**
 * Convert string defined regex to regex object.
 */
export function extractExternalRegExps(externalLibs: string[] = []) {
    return externalLibs.map((libStr) => new RegExp(libStr));
}

export function takePackageNameFromPath(pathLocation: string) {
    // get the name. E.g. node_modules/packageName/not/this/part.js
    // or node_modules/packageName
    const result: string[] = pathLocation.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);

    if (!result.length) {
        return;
    }

    let packageName: string = result[1];

    if (packageName.startsWith('@')) {
        const name = /[\\/]node_modules[\\/](.*?)([\\/])(.*?)([\\/])|$/.exec(pathLocation)[0].split('/node_modules/')[1];
        packageName = name.substr(0, name.length - 1);
    }

    return packageName;
}

/**
 * Search for package json file
 */
export function takeChunkPackageJson(chunk: any, defaultBasePath: string, librariesConfig: LibrariesConfig) {
    const packageName = takePackageNameFromPath(chunk.context as string);
    const packageJsonPath = path.join(librariesConfig[packageName].context || defaultBasePath, 'node_modules', packageName, 'package.json');

    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
}

/**
 * This function in combination with webpack optimization.splitChunks.cacheGroups.[funcName]
 * will split all the vendors in named chunks per library. The name of the chunk will contain
 * the library name and version.
 * @param module Node Module
 * @param defaultBasePath Project Root
 */
export function splitVendorsIntoChunks(
    module: any,
    defaultBasePath: string,
    librariesConfig: any,
    vendorTracker?: (packageName: string) => any
    ) {
    const packageJson = takeChunkPackageJson(module, defaultBasePath, librariesConfig);

    let packageJsonName: string = packageJson.name;
    // This is needed because otherwise webpack will create dir with subdirs
    if (packageJsonName.includes('/')) {
        packageJsonName = packageJsonName.replace('/', VCD_CUSTOM_LIB_SEPARATOR);
    }

    const packageName = `${packageJsonName}@${packageJson.version}`;

    if (vendorTracker) {
        vendorTracker(packageName);
    }

    return packageName;
}

export function addLibToManifest(
    librariesConfig: LibrariesConfig,
    packageName: string,
    location: string,
    jsonpFunction: string,
    manifest: ExtensionManifest,
    manifestJsonPath: string
) {
    if (!manifest) {
        throw Error(`Manifest file wasn't found.`);
    }

    if (!manifest.externals) {
        manifest.externals = {};
    }

    if (!manifest.externals.libs) {
        manifest.externals.libs = {};
    }

    if (!manifest.externals.jsonpFunction) {
        manifest.externals.jsonpFunction = jsonpFunction;
    }

    let [libName, version] = packageName.split("@").filter(Boolean);
    libName = `@${libName}`;
    const preDefinedLocation = librariesConfig[libName].location;
    const scope: LibraryConfigScopeTypes = librariesConfig[libName].scope;

    if (!version || !version.length) {
        throw Error(`${libName} has incorrect version defined! Current version ${version}`);
    }

    if (!scope || LibraryConfigScopes.indexOf(scope) === -1) {
        throw Error(`${libName} with version ${version} has incorrect scope defined! Current scope ${scope}.`);
    }

    if (!preDefinedLocation && (!location || !location.length)) {
        throw Error(`${libName} with version ${version} was not found in the list of built vendor bundles.
        Please make sure you passed the correct lib name and version in your angular.json builder config section.`);
    }

    manifest.externals.libs[libName] = {
        version,
        scope,
        location: preDefinedLocation || location.replace('/', VCD_CUSTOM_LIB_SEPARATOR),
    };

    fs.writeFileSync(manifestJsonPath, JSON.stringify(manifest, null, 4));
}

/**
 * Filter the node_modules and extract
 * those which has to be bundled with the plugin.
 */
export function filterRuntimeModules(options: BasePluginBuilderSchema) {
    return (mod) => {
        if (!mod.context) {
            return false;
        }

        // Only node_modules are needed and these which are defiend in the librariesConfig
        if (
            !mod.context.includes('node_modules') ||
            !Object.keys(options.librariesConfig).some((key) => {
                return mod.context.includes(key);
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
export function nameVendorFile(config: any, options: BasePluginBuilderSchema, pluginLibsBundles: Map<string, string>, manifest: ExtensionManifest, manifestJsonPath: string) {
    return (module) => {
        return splitVendorsIntoChunks(module, config.context, options.librariesConfig, (packageName: string) => {
            packageName = packageName.replace(VCD_CUSTOM_LIB_SEPARATOR, '/');
            pluginLibsBundles.set(packageName, `${packageName}.bundle.js`);

            addLibToManifest(
                options.librariesConfig,
                packageName,
                pluginLibsBundles.get(packageName),
                config.output.jsonpFunction,
                manifest,
                manifestJsonPath
            );
        });
    };
}
