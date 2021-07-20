/**
 * Singleton holding data store instance
 */
export class PluginStore {

    private static instance: PluginStore;
    /**
     * A map user for data store
     */
    private data = new Map();

    private constructor() {
    }

    /**
     * Returns a single instance of PluginStore
     */
    public static getInstance(): PluginStore {
        if (!this.instance) {
            this.instance = new PluginStore();
        }

        return this.instance;
    }

    /**
     * Stores an object
     * @param key - data write key
     * @param data - object containing data
     */
    public store<T>(key: string, data: T) {
        this.data.set(key, data);
    }

    /**
     * Returns stored data by key
     * @param key - data read key
     */
    public get<T>(key: string): T {
        return this.data.get(key);
    }

    /**
     * Clears the data store
     */
    public clear() {
        this.data.clear();
    }
}
