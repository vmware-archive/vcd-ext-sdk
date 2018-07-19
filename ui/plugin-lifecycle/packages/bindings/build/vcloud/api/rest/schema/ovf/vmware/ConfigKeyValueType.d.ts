export declare abstract class ConfigKeyValueType {
    required?: boolean;
    key?: string;
    value?: string;
}
export declare namespace ConfigKeyValueType {
    class Fields {
        static readonly REQUIRED: "required";
        static readonly KEY: "key";
        static readonly VALUE: "value";
    }
}
