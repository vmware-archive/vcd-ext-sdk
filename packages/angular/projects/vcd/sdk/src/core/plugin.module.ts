import { Store } from '@ngrx/store';
import { ExtensionNavRegistration, ExtensionNavRegistrationAction } from '../common';
import { TranslateService } from '../i18n';

export class PluginModule {
    private translate: TranslateService;

    constructor(private appStore: Store<any>, translate?: TranslateService) {
        if (translate) {
            this.translate = translate;
            this.translate.prepareTranslations(this.getSupportedLanguages(), this.getDefaultLanguage());
        }
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
