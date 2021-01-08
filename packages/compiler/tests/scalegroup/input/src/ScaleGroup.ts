import { AccessControl } from '../../../../'

/**
 * Interface describing behaviours for elasticity
 * @definedEntityInterface
 */
export interface ElasticGroup {
    initScaleGroup(): void
    grow(): void
    shrink(): void
}

/**
 * A definition of a group of VMs, which can be scaled out and in.
 * @definedEntityType
 */
export class ScaleGroup implements ElasticGroup {
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
    rules: Rule[]
    children?: string[];
    lastScaleTime?: number;

    @AccessControl('urn:vcloud:accessLevel:FullControl')
    initScaleGroup(): void {}

    @AccessControl('urn:vcloud:accessLevel:FullControl')
    grow(): void {}

    @AccessControl('urn:vcloud:accessLevel:FullControl')
    shrink(): void {}
}

export const enum LoadBalancerType {
    AVI = "avi", PROVIDED = "provided"
}
export class LoadBalancer {
    type: LoadBalancerType;
    networkId?: string;
    networkCIDR?: string;
    edgeId?: string;
    poolId?: string;
    virtualServiceIp?: string;
    serviceEngineGroupId?: string;
}

export const enum ScaleGroupStatus {
    CREATED = "created",
    ERROR = "error",
    ENABLED = "enabled",
    DISABLED = "disabled"
}

export const enum RuleOperator {
    AND = "AND", OR = "OR"
}

export const enum RuleBehaviour {
    GROW = "grow", SHRINK = "shrink"
}

export const enum SymptomOperator {
    GT = "GT", LT = "LT", GTE = "GTE", LTE = "LTE", EQ = "EQ"
}

export class Rule {
    name: string;
    operator: RuleOperator;
    behaviour: RuleBehaviour;
    vmCount: number;
    cooldown: number;
    symptoms: Symptom[];
}

export class Symptom {
    metric: string;
    operator: SymptomOperator;
    value: number;
    duration?: number;
    beginTime?: number;
}
