/** vcloud-director-ui-extension-sample-dashboard-graphs
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Subject} from "rxjs";
import {DashboardGraphDefinition, DashboardGraphsSettings} from "./dashboard-graphs.model";

/**
 * The key in local storage we save to.
 */
export const LOCAL_STORAGE_KEY = "urn:vcloud:dashboard-graphs:storage-key";

/**
 * Simple settings service for storing graph configuration.  Currently uses local storage.
 */
export class DashboardGraphsSettingsService {
	
    /**
     * The current settings.
     */
	private _graphsSettings: DashboardGraphsSettings;

    /**
     * Triggered when the settings are changed.
     */
	private _settingsChanged = new Subject<void>();

    /**
     * Emits when the settings are changed.
     */
	readonly settingsChanged = this._settingsChanged.asObservable();

    /**
     * Obtain access to local storage, and decode settings (as JSON).  In the case of any problems,
     * log and reset to unconfigured.
     */
	constructor() {
		if (typeof(Storage) == "undefined") {
		    throw new Error("Local storage not supported");
		}

        const graphSettingsJson = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (graphSettingsJson) {
            try {
               	this._graphsSettings = JSON.parse(graphSettingsJson);
            	if (!Array.isArray(this._graphsSettings.graphs)) {
            		throw new Error("graphs value is not an array");
            	}
            } catch (e) {
            	console.error("Could not parse local storage value!", graphSettingsJson, e);
        	    this._graphsSettings = {graphs: []};
            }
        } else {
            this._graphsSettings = {graphs: []};
        }
	}

    /**
     * Get configured graphs.
     */
    get graphs() {
    	return this._graphsSettings.graphs;
    }

    /**
     * Add a configured graph and save to local storage.
     */
    addGraph(graph: DashboardGraphDefinition) {
    	this._graphsSettings.graphs.push(graph);
    	this.save();
    }

    /**
     * Remove a configured graph and save to local storage.
     */
    removeGraph(index: number) {
    	this._graphsSettings.graphs.splice(index, 1);
    	this.save();
    }

    /**
     * Save to local storage (as JSON).
     */
    private save() {
    	window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._graphsSettings));
    }

}