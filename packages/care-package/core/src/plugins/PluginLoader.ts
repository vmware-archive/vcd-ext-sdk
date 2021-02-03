import { Plugin } from '@vcd/care-package-def';
import defaultPlugins from './DefaultPlugins';

export interface PluginExtended extends Plugin {
    module: string;
}

export default class PluginLoader {
    public static async loadWithDefaults(pluginNames: string[] = []): Promise<PluginExtended[]> {
        return this.load([...new Set([...defaultPlugins, ...pluginNames])]);
    }
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

