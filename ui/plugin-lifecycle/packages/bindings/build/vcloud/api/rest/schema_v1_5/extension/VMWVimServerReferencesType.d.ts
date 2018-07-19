import { ResourceType } from "./../ResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class VMWVimServerReferencesType extends ResourceType {
    vimServerReference?: ReferenceType[];
}
export declare namespace VMWVimServerReferencesType {
    class Fields extends ResourceType.Fields {
        static readonly VIM_SERVER_REFERENCE: "vimServerReference";
    }
}
