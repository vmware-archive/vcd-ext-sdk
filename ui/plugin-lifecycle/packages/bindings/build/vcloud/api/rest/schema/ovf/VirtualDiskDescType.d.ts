export declare class VirtualDiskDescType {
    any?: object[];
    capacity?: string;
    capacityAllocationUnits?: string;
    diskId?: string;
    fileRef?: string;
    format?: string;
    parentRef?: string;
    populatedSize?: number;
    otherAttributes?: object;
}
export declare namespace VirtualDiskDescType {
    class Fields {
        static readonly ANY: "any";
        static readonly CAPACITY: "capacity";
        static readonly CAPACITY_ALLOCATION_UNITS: "capacityAllocationUnits";
        static readonly DISK_ID: "diskId";
        static readonly FILE_REF: "fileRef";
        static readonly FORMAT: "format";
        static readonly PARENT_REF: "parentRef";
        static readonly POPULATED_SIZE: "populatedSize";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
