import { Hook } from '@oclif/config';
import { AnalyticsCollector } from '../../analytics/collector';
import { EventType } from '../../analytics/payload';
/**
 * 'prerun' CLI hook which runs before running a CLI command
 * @param options - hook options
 */
const hook: Hook<'prerun'> = async (options) => {
    return AnalyticsCollector.send(EventType.PRERUN, options);
};
export default hook;
