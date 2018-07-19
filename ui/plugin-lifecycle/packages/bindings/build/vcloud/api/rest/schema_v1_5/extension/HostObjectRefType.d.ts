import { VimObjectRefType } from "./VimObjectRefType";
export declare class HostObjectRefType extends VimObjectRefType {
    username?: string;
    password?: string;
}
export declare namespace HostObjectRefType {
    class Fields extends VimObjectRefType.Fields {
        static readonly USERNAME: "username";
        static readonly PASSWORD: "password";
    }
}
