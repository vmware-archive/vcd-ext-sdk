import { NetworkType } from "./NetworkType";
export declare class VAppNetworkType extends NetworkType {
    deployed?: boolean;
}
export declare namespace VAppNetworkType {
    class Fields extends NetworkType.Fields {
        static readonly DEPLOYED: "deployed";
    }
}
