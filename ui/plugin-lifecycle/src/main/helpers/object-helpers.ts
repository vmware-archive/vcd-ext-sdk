export function createStringEnum<T extends string>(keys: T[]): {[K in T]: K} {
    return keys.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}

export const renameProp = (oldKeys: string[], newKeys: string[], obj: any): any => {
    oldKeys.forEach((oldkey: string, index: number) => {
        obj[newKeys[index]] = obj[oldkey];
        delete obj[oldkey];
    });

    return obj;
};

export const getPropsWithout = (names: string[], object: any): any => Object.keys(object)
    .filter((key) => names.indexOf(key) === -1)
    .reduce((newObject, currentKey) => ({
        ...newObject,
        [currentKey]: object[currentKey]
    }), {});


