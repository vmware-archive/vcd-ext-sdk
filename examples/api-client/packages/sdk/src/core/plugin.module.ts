import { Store } from "@ngrx/store";
import { TranslateService } from "../i18n";
import { ExtensionNavRegistration, ExtensionNavRegistrationAction } from "../common";

export class PluginModule {
    constructor(private appStore: Store<any>, private translate: TranslateService) {
        this.translate.prepareTranslations(this.getSupportedLanguages(), this.getDefaultLanguage());
    }

    protected registerExtension(extension: ExtensionNavRegistration): void {
        this.appStore.dispatch(new ExtensionNavRegistrationAction(extension));
    }

    protected getDefaultLanguage(): string {
        return 'en';
    }

    protected getSupportedLanguages(): string[] {
        return ['en'];
    }
}
