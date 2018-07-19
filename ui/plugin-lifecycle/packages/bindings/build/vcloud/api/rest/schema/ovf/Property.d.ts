import { MsgType } from "./MsgType";
import { PropertyConfigurationValueType } from "./PropertyConfigurationValueType";
export declare class Property {
    label?: MsgType;
    description?: MsgType;
    valueElement?: PropertyConfigurationValueType[];
    key?: string;
    password?: boolean;
    qualifiers?: string;
    type?: string;
    userConfigurable?: boolean;
    valueAttrib?: string;
    otherAttributes?: object;
}
export declare namespace Property {
    class Fields {
        static readonly LABEL: "label";
        static readonly DESCRIPTION: "description";
        static readonly VALUE_ELEMENT: "valueElement";
        static readonly KEY: "key";
        static readonly PASSWORD: "password";
        static readonly QUALIFIERS: "qualifiers";
        static readonly TYPE: "type";
        static readonly USER_CONFIGURABLE: "userConfigurable";
        static readonly VALUE_ATTRIB: "valueAttrib";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
