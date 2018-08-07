export function createStringEnum<T extends string>(keys: T[]): {[K in T]: K} {
    return keys.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
