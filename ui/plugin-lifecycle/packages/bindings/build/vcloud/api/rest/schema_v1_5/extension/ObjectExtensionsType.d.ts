import { ResourceType } from "./../ResourceType";
import { ObjectExtensionType } from "./ObjectExtensionType";
export declare class ObjectExtensionsType extends ResourceType {
    objectExtension?: ObjectExtensionType[];
}
export declare namespace ObjectExtensionsType {
    class Fields extends ResourceType.Fields {
        static readonly OBJECT_EXTENSION: "objectExtension";
    }
}
