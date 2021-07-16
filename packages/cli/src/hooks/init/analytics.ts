import { Hook } from '@oclif/config';
import { ConsentStore } from '../../analytics/store';
/**
 * 'init' CLI hook which runs on CLI start
 * @param options - hook options
 */
const hook: Hook<'init'> = async (options) => {
    const store = new ConsentStore();
    if (!store.isConsentAsked() && !options.argv.includes('--ci')) {
        return store.promptAndStore();
    }
    return Promise.resolve();
};
export default hook;
