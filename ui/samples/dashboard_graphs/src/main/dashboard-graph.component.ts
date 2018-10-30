import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {common} from "@vcd/sdk";
import {DashboardGraphDefinition} from "./dashboard-graphs.model";
import {DashboardGraphsRendererService} from "./dashboard-graphs-renderer.service";

const cssClasses = {
	"sm": "card-img graph-short",
	"md": "card-img graph-short",
	"lg": "card-img graph-tall",
	"xl": "card-img graph-tall"
}

@Component({
    selector: 'vcd-dashboard-graph',
    templateUrl: './dashboard-graph.component.html',
    styles: [`
        .graph-short {
        	height: 20em;
        }

        .graph-tall {
        	height: 30em;
        }
    `]
})
export class DashboardGraphComponent implements OnInit, OnDestroy {
	@ViewChild("canvas")
	private canvas: ElementRef;

	@Input("graphDefinition")
	private graphDefinition: DashboardGraphDefinition;

	private registrationId: number = null;
	
    @Output("onRemove")
    readonly onRemove: EventEmitter<void> = new EventEmitter<void>();

	constructor(private rendererService: DashboardGraphsRendererService) {
	}

    onRemoveClicked() {
        this.onRemove.emit();
    }

    ngOnInit() {
        this.rendererService.registerGraph(this.canvas.nativeElement, this.graphDefinition);
    }

	ngOnDestroy() {
        if (this.registrationId !== null) {
            this.rendererService.unregisterGraph(this.registrationId);
            this.registrationId = null;
		}
    }

    get cssClass() {
    	const size = (this.graphDefinition && this.graphDefinition.size) || "xl";
    	return cssClasses[size] || cssClasses["xl"];
    }
}
