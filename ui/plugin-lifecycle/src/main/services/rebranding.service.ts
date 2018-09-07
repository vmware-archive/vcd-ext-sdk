import { Injectable } from "@angular/core";
import { VcdApiClient } from "@vcd/sdk";
import { Observable } from "rxjs/Observable";

export interface VcdUiTheme {
    themeType: string;
    name: string;
}

export interface VcdUiPortalMetadata {
    portalName: string;
    portalColor: string;
    selectedTheme: VcdUiTheme;
    customLinks: string[];
}

@Injectable()
export class RebrandingService {
    constructor(
        private client: VcdApiClient
    ) { }

    public getThemeData(): Observable<VcdUiPortalMetadata> {
        return this.client.get<VcdUiPortalMetadata>("cloudapi/branding");
    }

    public getThemes(): Observable<VcdUiTheme[]> {
        return this.client.get<VcdUiTheme[]>("cloudapi/branding/themes");
    }

    public putTemeData(data: VcdUiPortalMetadata): Observable<VcdUiPortalMetadata> {
        return this.client.updateSync<VcdUiPortalMetadata>("cloudapi/branding", data);
    }

    public putLogo(logo: ArrayBuffer): Observable<ArrayBuffer> {
        return this.client.updateSync<ArrayBuffer>("cloudapi/branding/logo", logo);
    }
}
