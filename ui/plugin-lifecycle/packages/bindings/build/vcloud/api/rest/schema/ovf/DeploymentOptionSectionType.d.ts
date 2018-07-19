import { DeploymentOptionSectionConfiguration } from "./DeploymentOptionSectionConfiguration";
import { SectionType } from "./SectionType";
export declare class DeploymentOptionSectionType extends SectionType {
    configuration?: DeploymentOptionSectionConfiguration[];
    any?: object[];
}
export declare namespace DeploymentOptionSectionType {
    class Fields extends SectionType.Fields {
        static readonly CONFIGURATION: "configuration";
        static readonly ANY: "any";
    }
}
