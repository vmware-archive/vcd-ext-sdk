import { Plugin } from '@vcd/care-package-def';
import defaultPlugins from './DefaultPlugins';

/**
 * PluginExtended holds a module property which holds module name from which the plugin was loaded
 * for example "@vcd/care-package-plugin-types/TypesCarePackagePlugin"
 */
export interface PluginExtended extends Plugin {
    module: string;
}

/**
 * Loads plugins by name
 */
export default class PluginLoader {

    /**
     * Loads default plugins
     * @param pluginNames - List of plugin module names
     */
    public static async loadWithDefaults(pluginNames: string[] = []): Promise<PluginExtended[]> {
        return this.load([...new Set([...defaultPlugins, ...pluginNames])]);
    }

    /**
     * Loads plugins by module name and class name.
     * @param pluginNames - List of plugin module names
     */
    // TODO For custom plugins bundled in package.care, plugins must be loaded from a specific file
    public static async load(pluginNames: string[]): Promise<PluginExtended[]> {
        const promises = pluginNames
            .map(async (name) => {
                const nameTokens = name.split('/');
                const pluginClass = nameTokens.pop();
                const PluginModule = await import(nameTokens.join('/'));
                const pluginInstance = PluginModule[pluginClass];
                pluginInstance.module = name;
                return pluginInstance;
            });
        return Promise.all(promises);
    }
}

