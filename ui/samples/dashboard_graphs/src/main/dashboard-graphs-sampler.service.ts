/** vcloud-director-ui-extension-sample-dashboard-graphs
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Subject} from "rxjs";
import {common} from "@vcd/sdk";
import {Inject} from "@angular/core";
import {vcloud} from "@vcd/bindings";
import {VcdApiClient} from "@vcd/sdk";
import {DashboardGraphDefinition, DashboardGraphMetric, DashboardGraphSample} from "./dashboard-graphs.model";
import OrgVdcRollupType = vcloud.api.rest.schema_v1_5.OrgVdcRollupType;

/**
 * How many seconds to wait before getting another sample.
 * This could be a setting...  exercise left to the reader. :-)
 */
const refreshPeriodSeconds = 5;

/**
 * How many samples to keep in memory.
 * This could be a setting...  exercise left to the reader. :-)
 */
const historyMax = 10;

/**
 * This service automatically fetches samples at an interval and maintains a set
 * number of them.  It has an Osbervable that will emit whenever a new set of samples
 * are available.
 */
export class DashboardGraphsSamplerService {
	
    /**
     * This will contain the URL to fetch the sample from.
     */
    private rollupUrl: string;

    /**
     * This contains all historical samples.
     */
    private _samples: DashboardGraphSample[] = [];

    /**
     * Triggered when new samples are available.
     */
    private _samplesChanged = new Subject<void>();

    /**
     * Emits when new samples are available.
     */
    readonly samplesChanged = this._samplesChanged.asObservable();

    /**
     * Inject the API client, and use it to find the organization from the session.
     * Once found, synthesize the vdcRollup URL and start the fetch loop.
     */
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

    /**
     * Return the available samples.
     */
    get samples(): DashboardGraphSample[] {
        return this._samples;
    }

    /**
     * Fetch the rollup data and create a new sample.
     * Then delay and call self again.
     */
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

    /**
     * Helper to get current CPU usage.
     */
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

    /**
     * Helper to get current memory usage.
     */
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

    /**
     * Helper to get current storage usage.
     */
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