import { Store } from '@ngrx/store';
import { ExtensionNavRegistration, ExtensionNavRegistrationAction } from '../common';

export class PluginModule {

    constructor(private appStore: Store<any>) {
    }

    protected registerExtension(extension: ExtensionNavRegistration): void {
        this.appStore.dispatch(new ExtensionNavRegistrationAction(extension));
    }
}

/**
 * Config object that is passed on VcdSdkModule init
 * using .forRoot() method. It can be used to store
 * configutration properties that are later used by the Services
 * provided.
 */
export class VcdSdkConfig {
    apiVersion: string;
}