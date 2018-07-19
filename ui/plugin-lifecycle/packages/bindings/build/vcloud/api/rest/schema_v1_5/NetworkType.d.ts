import { NetworkConfigurationType } from "./NetworkConfigurationType";
import { EntityType } from "./EntityType";
export declare abstract class NetworkType extends EntityType {
    configuration?: NetworkConfigurationType;
}
export declare namespace NetworkType {
    class Fields extends EntityType.Fields {
        static readonly CONFIGURATION: "configuration";
    }
}
