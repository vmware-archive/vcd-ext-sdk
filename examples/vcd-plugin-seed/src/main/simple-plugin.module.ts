import {CommonModule} from "@angular/common";
import {Inject, NgModule, Optional} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {ClarityModule} from "clarity-angular";
import {Store} from "@ngrx/store";
import {API_ROOT_URL, EXTENSION_ROUTE, ExtensionNavRegistration, ExtensionNavRegistrationAction, I18nModule, AuthTokenHolderService} from "@vcd-ui/common";
import {SimpleComponent} from "./simple/simple.component";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";

const ROUTES: Routes = [
    { path: "", component: SimpleComponent }
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        I18nModule,
        VcdSdkModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        SimpleComponent
    ],
    bootstrap: [SimpleComponent],
    exports: [],
    providers: [VcdApiClient]
})
export class SimplePluginModule {
    constructor(private appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string, @Inject(API_ROOT_URL) private baseUrl: string, private client: VcdApiClient,
            @Optional() private authToken: AuthTokenHolderService) {
        const registration: ExtensionNavRegistration = {
            path: extensionRoute,
            icon: "page",
            nameCode: "nav.label",
            descriptionCode: "nav.description"
        };

        appStore.dispatch(new ExtensionNavRegistrationAction(registration));

        this.client.baseUrl = this.baseUrl;
        if (this.authToken) {
            this.client.setAuthentication(this.authToken.token).subscribe();
        }
    }
}
