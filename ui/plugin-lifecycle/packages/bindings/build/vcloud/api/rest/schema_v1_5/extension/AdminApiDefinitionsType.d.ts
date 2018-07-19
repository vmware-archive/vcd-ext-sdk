import { AdminApiDefinitionType } from "./AdminApiDefinitionType";
import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class AdminApiDefinitionsType extends VCloudExtensibleType {
    apiDefinition?: AdminApiDefinitionType[];
}
export declare namespace AdminApiDefinitionsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly API_DEFINITION: "apiDefinition";
    }
}
