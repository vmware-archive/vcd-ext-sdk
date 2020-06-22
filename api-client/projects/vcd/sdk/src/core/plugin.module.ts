import { Store } from '@ngrx/store';
import { ExtensionNavRegistration, ExtensionNavRegistrationAction } from '../common';

export class PluginModule {
    constructor(private appStore: Store<any>) {}

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
