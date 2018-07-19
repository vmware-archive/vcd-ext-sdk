import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class SnapshotType extends VCloudExtensibleType {
    created?: Date;
    poweredOn?: boolean;
    size?: number;
}
export declare namespace SnapshotType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly CREATED: "created";
        static readonly POWERED_ON: "poweredOn";
        static readonly SIZE: "size";
    }
}
