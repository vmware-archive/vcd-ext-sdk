import {Component, Inject} from "@angular/core";
import {EXTENSION_ASSET_URL} from '@vcd/sdk/common';

@Component({
    selector: "plugin-subnav",
    templateUrl: "./subnav.component.html",
    host: {'class': 'content-container'}
})
export class SubnavComponent {
    navItems: any[] = [
        {routerLink: "./status", iconShape: "help-info", labelKey: "subnav.menu.status"},
        {routerLink: "./about", iconShape: "helix", labelKey: "subnav.menu.about"}
    ];
    
    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string) {}
}
