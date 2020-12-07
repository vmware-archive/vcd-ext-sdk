import * as path from 'path';
import { AbstractPlugin } from '@vcd/care-package-plugins';

export class UiPluginCarePackagePlugin extends AbstractPlugin {
    name = 'uiPlugin';
    displayName = 'UI Plugin';

    getSrcRoot(): string {
        return path.join(__dirname, '..', 'templates');
    }
}