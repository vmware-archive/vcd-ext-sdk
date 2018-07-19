import { PayGoVdcSummaryType } from "./PayGoVdcSummaryType";
import { AllocationPoolVdcSummaryType } from "./AllocationPoolVdcSummaryType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReservationPoolVdcSummaryType } from "./ReservationPoolVdcSummaryType";
export declare class OrgVdcRollupType extends VCloudExtensibleType {
    numberOfOrgs?: number;
    numberOfPoweredOnVms?: number;
    numberOfDeployedVApps?: number;
    reservationPoolVdcSummary?: ReservationPoolVdcSummaryType;
    allocationPoolVdcSummary?: AllocationPoolVdcSummaryType;
    payGoVdcSummary?: PayGoVdcSummaryType;
}
export declare namespace OrgVdcRollupType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NUMBER_OF_ORGS: "numberOfOrgs";
        static readonly NUMBER_OF_POWERED_ON_VMS: "numberOfPoweredOnVms";
        static readonly NUMBER_OF_DEPLOYED_VAPPS: "numberOfDeployedVApps";
        static readonly RESERVATION_POOL_VDC_SUMMARY: "reservationPoolVdcSummary";
        static readonly ALLOCATION_POOL_VDC_SUMMARY: "allocationPoolVdcSummary";
        static readonly PAY_GO_VDC_SUMMARY: "payGoVdcSummary";
    }
}
