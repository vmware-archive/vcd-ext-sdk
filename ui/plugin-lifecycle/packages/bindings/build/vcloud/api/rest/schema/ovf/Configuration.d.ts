import { MsgType } from "./MsgType";
export declare class Configuration {
    label?: MsgType;
    description?: MsgType;
    _default?: boolean;
    id?: string;
    otherAttributes?: object;
}
export declare namespace Configuration {
    class Fields {
        static readonly LABEL: "label";
        static readonly DESCRIPTION: "description";
        static readonly _DEFAULT: "_default";
        static readonly ID: "id";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
