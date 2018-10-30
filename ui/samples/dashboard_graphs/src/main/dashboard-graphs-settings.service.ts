import {Subject} from "rxjs";
import {DashboardGraphDefinition, DashboardGraphsSettings} from "./dashboard-graphs.model";

export const LOCAL_STORAGE_KEY = "urn:vcloud:dashboard-graphs:storage-key";

export class DashboardGraphsSettingsService {
	
	private _graphsSettings: DashboardGraphsSettings;
	private _settingsChanged = new Subject<void>();
	readonly settingsChanged = this._settingsChanged.asObservable();

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

    get graphs() {
    	return this._graphsSettings.graphs;
    }

    addGraph(graph: DashboardGraphDefinition) {
    	this._graphsSettings.graphs.push(graph);
    	this.save();
    }

    removeGraph(index: number) {
    	this._graphsSettings.graphs.splice(index, 1);
    	this.save();
    }

    private save() {
    	window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._graphsSettings));
    }

}