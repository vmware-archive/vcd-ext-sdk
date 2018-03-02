import {Component, Inject} from "@angular/core";
import {EXTENSION_ASSET_URL} from '@vcd-ui/common';

@Component({
    selector: "plugin-simple",
    templateUrl: "./simple.component.html",
    styleUrls: ['./simple.component.scss'],
    host: {'class': 'content-container'}
})
export class SimpleComponent {
    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string) {}
}
