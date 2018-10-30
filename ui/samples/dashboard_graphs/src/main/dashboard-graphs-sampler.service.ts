import {Subject} from "rxjs";
import {common} from "@vcd/sdk";
import {Inject} from "@angular/core";
import {vcloud} from "@vcd/bindings";
import {VcdApiClient} from "@vcd/sdk";
import {DashboardGraphDefinition, DashboardGraphMetric, DashboardGraphSample} from "./dashboard-graphs.model";

type OrgVdcRollupType = vcloud.api.rest.schema_v1_5.OrgVdcRollupType;

const refreshPeriodSeconds = 5;
const historyMax = 10;

export class DashboardGraphsSamplerService {
	
    private rollupUrl: string;
    private _samples: DashboardGraphSample[] = [];
    private _samplesChanged = new Subject<void>();
    readonly samplesChanged = this._samplesChanged.asObservable();

    constructor(@Inject(VcdApiClient) private vcdApiClient: VcdApiClient) {
        vcdApiClient.session.subscribe((session) => {
            const orgLink = session.link
                .find((link) => link.type == "application/vnd.vmware.vcloud.org+xml" && link.name == session.org);
            if (!orgLink) {
                console.error("No org link found", session);
                return;
            }
            
            const matches = /\/(org\/[^/]+)\/?/.exec(orgLink.href);
            const endpoint = matches[1];
            if (!endpoint) {
                console.error("No org ID found", orgLink.href);
                return;                
            }

            this.rollupUrl = `api/${endpoint}/vdcRollup`;
            this.getNextSample();
        });
    }

    get samples(): DashboardGraphSample[] {
        return this._samples;
    }

    private getNextSample() {
    	this.vcdApiClient.get<OrgVdcRollupType>(this.rollupUrl)
    	    .toPromise()
    	    .then((rollup) => {
    	    	const timestamp = new Date();
    	    	const orgCount = (rollup.numberOfOrgs === null) ? 1 : 0;
    	    	const vmCount = rollup.numberOfPoweredOnVms;
    	    	const vappCount = rollup.numberOfDeployedVApps;
                const cpuUsage = this.getCpuUsage(rollup);
                const memUsage = this.getMemUsage(rollup);
                const storageUsage = this.getStorageUsage(rollup);
                const sample: DashboardGraphSample = {
                	timestamp, orgCount, vmCount, vappCount, cpuUsage, memUsage, storageUsage
                };
                this.samples.push(sample);
                if (this.samples.length > historyMax) {
                    this.samples.splice(0, this.samples.length - historyMax);
                }
                this._samplesChanged.next();
    	    	setTimeout(() => this.getNextSample(), refreshPeriodSeconds * 1000);
    	    }).catch((err) => {
    	    	console.warn("Couldn't fetch sample", err);
    	    	setTimeout(() => this.getNextSample(), refreshPeriodSeconds * 1000);
    	    });
    }

    private getCpuUsage(rollup: OrgVdcRollupType) {
        if (rollup.allocationPoolVdcSummary && rollup.allocationPoolVdcSummary.cpuConsumptionMhz) {
            return rollup.allocationPoolVdcSummary.cpuConsumptionMhz;
        } else if (rollup.reservationPoolVdcSummary && rollup.reservationPoolVdcSummary.cpuConsumptionMhz) {
            return rollup.reservationPoolVdcSummary.cpuConsumptionMhz;
        } else if (rollup.payGoVdcSummary && rollup.payGoVdcSummary.cpuConsumptionMhz) {
            return rollup.payGoVdcSummary.cpuConsumptionMhz;
        }
        return 0;
    }

    private getMemUsage(rollup: OrgVdcRollupType) {
        if (rollup.allocationPoolVdcSummary && rollup.allocationPoolVdcSummary.memoryConsumptionMB) {
            return rollup.allocationPoolVdcSummary.memoryConsumptionMB;
        } else if (rollup.reservationPoolVdcSummary && rollup.reservationPoolVdcSummary.memoryConsumptionMB) {
            return rollup.reservationPoolVdcSummary.memoryConsumptionMB;
        } else if (rollup.payGoVdcSummary && rollup.payGoVdcSummary.memoryConsumptionMB) {
            return rollup.payGoVdcSummary.memoryConsumptionMB;
        }
        return 0;
    }

    private getStorageUsage(rollup: OrgVdcRollupType) {
        if (rollup.allocationPoolVdcSummary && rollup.allocationPoolVdcSummary.storageConsumptionMB) {
            return rollup.allocationPoolVdcSummary.storageConsumptionMB;
        } else if (rollup.reservationPoolVdcSummary && rollup.reservationPoolVdcSummary.storageConsumptionMB) {
            return rollup.reservationPoolVdcSummary.storageConsumptionMB;
        } else if (rollup.payGoVdcSummary && rollup.payGoVdcSummary.storageConsumptionMB) {
            return rollup.payGoVdcSummary.storageConsumptionMB;
        }
        return 0;
    }

}