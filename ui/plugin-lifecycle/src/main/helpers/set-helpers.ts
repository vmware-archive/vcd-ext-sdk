export function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const _union = new Set(setA);

    setB.forEach((elem) => {
        _union.add(elem);
    });
    return _union;
}

export function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const _difference = new Set<T>(setA);

    setB.forEach((elem) => {
        _difference.delete(elem);
    });

    return _difference;
}
