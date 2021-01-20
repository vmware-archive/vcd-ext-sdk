import { Hook } from '@oclif/config';

import { ConsentStore } from '../../analytics/store';

const hook: Hook<'init'> = async (options) => {
    const store = new ConsentStore();
    if (!store.isConsentAsked() && !options.argv.includes('--ci')) {
        return store.promptAndStore();
    }
    return Promise.resolve();
};
export default hook;
