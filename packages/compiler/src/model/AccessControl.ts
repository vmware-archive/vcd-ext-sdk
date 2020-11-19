export function AccessControl(value: string) {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        // does nothing
    };
}
