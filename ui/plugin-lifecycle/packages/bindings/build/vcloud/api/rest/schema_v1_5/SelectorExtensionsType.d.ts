import { SelectorExtensionType } from "./SelectorExtensionType";
import { ResourceType } from "./ResourceType";
export declare class SelectorExtensionsType extends ResourceType {
    selectorExtension?: SelectorExtensionType[];
}
export declare namespace SelectorExtensionsType {
    class Fields extends ResourceType.Fields {
        static readonly SELECTOR_EXTENSION: "selectorExtension";
    }
}
