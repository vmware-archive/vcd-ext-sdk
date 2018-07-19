import { ResourceType } from "./../ResourceType";
import { VimObjectRefsType } from "./VimObjectRefsType";
export declare class VimObjectRefListType extends ResourceType {
    vimObjectRefs?: VimObjectRefsType;
}
export declare namespace VimObjectRefListType {
    class Fields extends ResourceType.Fields {
        static readonly VIM_OBJECT_REFS: "vimObjectRefs";
    }
}
