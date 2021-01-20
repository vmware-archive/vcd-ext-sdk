import { Hook } from '@oclif/config';
import { AnalyticsCollector } from '../../analytics/collector';
import { EventType } from '../../analytics/payload';

const hook: Hook<'prerun'> = async (options) => {
    return AnalyticsCollector.send(EventType.PRERUN, options);
};
export default hook;
