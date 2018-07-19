import { ParamsType } from "./ParamsType";
export declare class CreateSnapshotParamsType extends ParamsType {
    memory?: boolean;
    quiesce?: boolean;
}
export declare namespace CreateSnapshotParamsType {
    class Fields extends ParamsType.Fields {
        static readonly MEMORY: "memory";
        static readonly QUIESCE: "quiesce";
    }
}
