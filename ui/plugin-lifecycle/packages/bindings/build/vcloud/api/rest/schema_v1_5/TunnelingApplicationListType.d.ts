import { ContainerType } from "./ContainerType";
import { TunnelingApplicationType } from "./TunnelingApplicationType";
export declare class TunnelingApplicationListType extends ContainerType {
    tunnelingApplication?: TunnelingApplicationType[];
}
export declare namespace TunnelingApplicationListType {
    class Fields extends ContainerType.Fields {
        static readonly TUNNELING_APPLICATION: "tunnelingApplication";
    }
}
