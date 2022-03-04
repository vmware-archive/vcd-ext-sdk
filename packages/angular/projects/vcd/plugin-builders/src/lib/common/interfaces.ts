import { ConcatWebpackPluginOptionsEntries } from "./concat";

export interface LibrariesConfig {
    [libName: string]: {
        version: string;
        scope: LibraryConfigScopeTypes,
        location: string;
        // In most of the cases your lib is located in node_modules of the current project,
        // but sometimes you project could become more complex with multiple projeccts inside it,
        // respectivly with multiple node_modules in each sub project.
        // The context is used to define in whihc sub project the builder has to search for
        // your library.
        context: string;
    };
}

export type LibraryConfigScopeTypes = 'external' | 'bundled' | 'isolated';
export const LibraryConfigScopes = ['external', 'bundled', 'isolated'];

/**
 * The contents of a third party extension's manifest.json file.
 */
export interface ExtensionManifest {
    /**
     * The version of the manifest
     */
    manifestVersion: string;

    /**
     * Unique URN used an ID for the extension.
     */
    urn: string;

    /**
     * Human readable name for the extension.
     */
    name: string;

    /**
     * The minimum supported version of VCD UI.
     * TODO: Not currently used.
     */
    containerVersion: string;

    /**
     * Versions of VCD that the plugin claims compatibility with.
     */
    productVersions: string[];

    /**
     * The version of the extension.
     */
    version: string;

    /**
     * Scopes that the extension may be used under (e.g. tenant, service-provider).
     */
    scope: ExtensionScope[];

    /**
     * Minimum permissions required for the extension to be loaded.
     */
    permissions: string[];

    /**
     * Human readable description for the extension.
     */
    description: string;

    /**
     * Human readable vendor name for the extension.
     */
    vendor: string;

    /**
     * Human readable license information for the extension.
     */
    license: string;

    /**
     * Support URL for the extension.
     */
    link: string;

    /**
     * The symbol to be imported as an Angular 4 module from the
     * the extension's AMD bundle.
     */
    module: string;

    /**
     * The base route the extension's routes will be registered under.
     */
    route: string;

    /**
     * Formal extension points.
     */
    extensionPoints?: ExtensionPointManifest[];

    /**
     * Extension locales for the manifest.
     * Supported by manifest v2.0.0 and higher.
     */
    locales: {
        [key: string]: string
    };

    externals?: {
        libs?: {
            [libName: string]: {
                version: string;
                scope: ExtensionLibScope;
                location: string;
            };
        };
        jsonpFunction?: string;
    };
    /**
     * Containes the base px value of a plugin, used by the Core UI to calculate the rem scaler.
     */
    pluginBasePx?: number;
}

export type ExtensionLibScope = 'external' | 'bundled' | 'isolated';

/**
 * This defines a formal extension point.  An extension point is a declarative way for an extension manifest
 * to describe how the VCD application behaviour is extended or modified by the extension.
 */
export interface ExtensionPointManifest {
    /**
     * Universally unique URN that identifies this Extension Point.  It is suggested to preprend the extension's URN.
     */
    readonly urn: string;

    /**
     * The type of Extension Point being defined from a supported list.  This list will increase over time.
     */
    readonly type: string;

    /**
     * The name of the Extension Point, intended for display in extension management interfaces.
     */
    readonly name: string;

    /**
     * An overview of the Extension Point, intended for display in extension management interfaces.
     */
    readonly description: string;

    /**
     * The name of the module which will be registerd in the top-nav-level area.
     */
    readonly module?: string;

    /**
     * The route on which only top level extrension points will be registerd.
     */
    readonly route?: string;

    /**
     * Anuglar app custom styles and scripts list, loaded inside the shadow dom by the Core UI
     */
    styles?: string[];
    scripts?: string[];
}

/**
 * Supported extension scopes.
 */
export type ExtensionScope = 'tenant' | 'service-provder';

export interface BasePluginBuilderSchema {
    enableRuntimeDependecyManagement: boolean;
    /**
     * Preserve main plugin file contents.
     */
    preserveMainFile: boolean;
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
    /**
     * Force disable angular's ivy compiler if enabled
     */
    forceDisableIvy: boolean;
    /**
     * Enable/Disable Rem precalculation
     */
    precalculateRem: boolean;
    /**
     * Traverses all css and scss files and replaces all rem usages with calc(var(--plugin-name-css-scale-constant) * originalRemSize)
     */
    precalculateRemOptions: PrecalculateRemOptions;
    /**
     * List of files to be concatenated in a given file
     */
    concatGeneratedFiles: ConcatWebpackPluginOptionsEntries[];
    /**
     * List of global variables to be replaced.
     */
    replaceGlobalVarUsage: {
        [key: string]: string;
    };
}
export interface PrecalculateRemOptions {
    /**
     * How much px 1rem equals
     * 
     * Defaults to: 16
     */
    rootValue?: number,
    /**
     * List of CSS properties which rems will be precalculated
     * 
     * Example:
     * propList: ['font-size']
     * 
     * will precalculate the rem only of the font-size css.
     * 
     * Defaults to: ["*"]
     */
    propList?: string[],
    /**
     * Replace given css property which subject to rem precalculations,
     * if set to true replaces all properties from the `propList` with
     * their alternative.
     * 
     * Defaults to: true
     */
    replace?: boolean,
    /**
     * Skip rem precalculation if the value is less or equal to this treshold.
     * 
     * Defaults to: 0
     */
    minRemValue?: number,
    /**
     * The name of the css var that will be multiplier of the original rem size.
     */
    remScalerName?: string;
    /**
     * Replace all :root usages with :host usages, this is needed to isolate the css vars
     * for example, so once a css var is defined by the plugin it won't be accessible from outside,
     * or vice versa.
     */
    replaceRootWithHost?: boolean;
}