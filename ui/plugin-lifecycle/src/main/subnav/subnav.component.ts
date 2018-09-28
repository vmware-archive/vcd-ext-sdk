import { Component, Inject } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";

@Component({
    selector: "plugin-subnav",
    templateUrl: "./subnav.component.html",
    host: { "class": "content-container" }
})
export class SubnavComponent {
    navItems: any[] = [
        { routerLink: "./plugin-management", iconShape: "plugin", labelKey: "subnav.menu.status" },
        { routerLink: "./vcd-api-extensions", iconShape: "block", labelKey: "subnav.menu.api_extensions" },
        { routerLink: "./vcd-rebranding", iconShape: "wand", labelKey: "subnav.menu.rebranding" }
    ];

    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string) { }
}
