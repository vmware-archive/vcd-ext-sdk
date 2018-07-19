import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class Disk extends VCloudExtensibleType {
    size?: number;
    instanceId?: string;
}
export declare namespace Disk {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SIZE: "size";
        static readonly INSTANCE_ID: "instanceId";
    }
}
