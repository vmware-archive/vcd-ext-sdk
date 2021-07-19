import { Hook } from '@oclif/config';
import { AnalyticsCollector } from '../../analytics/collector';
import { EventType } from '../../analytics/payload';

/**
 * 'postrun' CLI hook which runs after successfully finished CLI command
 * @param options - hook options
 */
const hook: Hook<'postrun'> = async (options) => {
    return AnalyticsCollector.send(EventType.SUCCESS, options);
};
export default hook;
