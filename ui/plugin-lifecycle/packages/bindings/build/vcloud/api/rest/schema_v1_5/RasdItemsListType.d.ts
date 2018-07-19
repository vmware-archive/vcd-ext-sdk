import { RASDType } from "./../schema/ovf/RASDType";
import { ResourceType } from "./ResourceType";
export declare class RasdItemsListType extends ResourceType {
    item?: RASDType[];
}
export declare namespace RasdItemsListType {
    class Fields extends ResourceType.Fields {
        static readonly ITEM: "item";
    }
}
