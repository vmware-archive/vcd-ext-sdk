import defaultPlugins from './DefaultPlugins';
import { Plugin } from '@vcd/care-package-plugins';

export default class PluginLoader {
    public static async loadWithDefaults(pluginNames: string[] = []): Promise<Plugin[]> {
        return this.load([...new Set([...defaultPlugins, ...pluginNames])]);
    }
    public static async load(pluginNames: string[]): Promise<Plugin[]> {
        const promises = pluginNames
            .map(async (name) => {
                const nameTokens = name.split('/');
                const pluginClass = nameTokens.pop();
                const PluginModule = await import(nameTokens.join('/'));
                const pluginInstance = new PluginModule[pluginClass]();
                pluginInstance.module = name;
                return pluginInstance;
            });
        return Promise.all(promises);
    }
}

