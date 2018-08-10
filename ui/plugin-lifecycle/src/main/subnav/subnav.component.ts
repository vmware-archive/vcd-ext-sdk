import {Component, Inject} from "@angular/core";
import {EXTENSION_ASSET_URL} from "@vcd-ui/common";

@Component({
    selector: "plugin-subnav",
    templateUrl: "./subnav.component.html",
    host: {"class": "content-container"}
})
export class SubnavComponent {
    navItems: any[] = [
        {routerLink: "./plugin-management", iconShape: "help-info", labelKey: "subnav.menu.status"},
        {routerLink: "./branding", iconShape: "helix", labelKey: "subnav.menu.about"}
    ];

    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string) {}
}
