import { Hook } from '@oclif/config';
import { AnalyticsCollector } from '../../analytics/collector';
import { EventType } from '../../analytics/payload';

const hook: Hook<'postrun'> = async (options) => {
    return AnalyticsCollector.send(EventType.SUCCESS, options);
};
export default hook;
