import { VimObjectRefType } from "./VimObjectRefType";
export declare class DiskDatastoreType extends VimObjectRefType {
    instanceId?: string;
}
export declare namespace DiskDatastoreType {
    class Fields extends VimObjectRefType.Fields {
        static readonly INSTANCE_ID: "instanceId";
    }
}
