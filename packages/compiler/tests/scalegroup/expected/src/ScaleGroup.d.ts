/**
 * Interface describing behaviours for elasticity
 * @definedEntityInterface
 */
export interface ElasticGroup {
    initScaleGroup(): void;
    grow(): void;
    shrink(): void;
}
/**
 * A definition of a group of VMs, which can be scaled out and in.
 * @definedEntityType
 */
export declare class ScaleGroup implements ElasticGroup {
    name: string;
    status: ScaleGroupStatus;
    errorMessage?: string;
    orgVdcId: string;
    loadBalancer: LoadBalancer;
    vmTemplateId: string;
    computePolicyId?: string;
    storagePolicyId?: string;
    minVms: number;
    maxVms: number;
    rules: Rule[];
    children?: string[];
    lastScaleTime?: number;
    initScaleGroup(): void;
    grow(): void;
    shrink(): void;
}
export declare const enum LoadBalancerType {
    AVI = "avi",
    PROVIDED = "provided"
}
export declare class LoadBalancer {
    type: LoadBalancerType;
    networkId?: string;
    networkCIDR?: string;
    edgeId?: string;
    poolId?: string;
    virtualServiceIp?: string;
    serviceEngineGroupId?: string;
}
export declare const enum ScaleGroupStatus {
    CREATED = "created",
    ERROR = "error",
    ENABLED = "enabled",
    DISABLED = "disabled"
}
export declare const enum RuleOperator {
    AND = "AND",
    OR = "OR"
}
export declare const enum RuleBehaviour {
    GROW = "grow",
    SHRINK = "shrink"
}
export declare const enum SymptomOperator {
    GT = "GT",
    LT = "LT",
    GTE = "GTE",
    LTE = "LTE",
    EQ = "EQ"
}
export declare class Rule {
    name: string;
    operator: RuleOperator;
    behaviour: RuleBehaviour;
    vmCount: number;
    cooldown: number;
    symptoms: Symptom[];
}
export declare class Symptom {
    metric: string;
    operator: SymptomOperator;
    value: number;
    duration?: number;
    beginTime?: number;
}
