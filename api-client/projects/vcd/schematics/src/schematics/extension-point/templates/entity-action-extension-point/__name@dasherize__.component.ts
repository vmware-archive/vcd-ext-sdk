import { Component } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { EntityActionExtensionComponent, EntityActionExtensionMenuEntry } from "@vcd/sdk/common";

@Component({
    selector: '<%= dasherize(name) %>',
    templateUrl: './<%= dasherize(name) %>.component.html'
})
export class <%= classify(name) %>Component extends EntityActionExtensionComponent {
    modalText = "";
    opened = false;

    private result: Subject<{ refreshRequested: boolean }>;

    getMenuEntry(entityUrn: string): Observable<EntityActionExtensionMenuEntry> {
        return Observable.of({
            text: "Example Action",
            children: [{
                urn: "urn:vmware:vcloud:example:child",
                text: "Example Child Action",
                busy: false,
                enabled: true
            }]
        });
    }

    performAction(menuItemUrn: string, entityUrn: string): Observable<{ refreshRequested: boolean }> {
        this.modalText = `Entity: ${entityUrn}  Action: ${menuItemUrn}`;
        this.opened = true;
        this.result = new Subject<{ refreshRequested: boolean }>();
        return this.result.asObservable();
    }

    onClose() {
        this.opened = false;
        this.result.next({ refreshRequested: true });
        this.result.complete();
    }

}