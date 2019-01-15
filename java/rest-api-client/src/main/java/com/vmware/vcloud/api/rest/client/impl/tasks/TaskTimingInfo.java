/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client.impl.tasks;

import java.util.Date;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Manages known earliest known start and end times and calculates best end time value to use when
 * querying for completed tasks.
 * <P>
 * This class's implementation is closely tied to the implementation of {@link VcdBulkTaskMonitor}
 * and is meant for its exclusive use.
 *
 * @since 8.10
 */
class TaskTimingInfo {
    private final AtomicReference<Date> earliestKnownStartTime = new AtomicReference<>();

    private final AtomicReference<Date> earliestKnownEndTime = new AtomicReference<>();

    TaskTimingInfo() {}

    /**
     * Updates the earliest known start time, if necessary.
     * <P>
     * If the start time passed is later currently known earliest start time, it is ignored.
     * <BR>
     * If the start time passed as a argument is before the {@link #earliestKnownStartTime}, its
     * value is updated and {@link #earliestKnownEndTime} is cleared. This allows for the following
     * query to run with the {@code #earliestKnownStartTime} so that tasks that may have potentially
     * ended before tracking began can now be found an updated. This reset functionality is expected
     * to be rarely used in most known circumstances as most tasks are expected to be added in order
     * of their creation, but this reset behavior can account for odd edge cases.
     *
     * @param startTime
     *            a new start time that was encountered.
     */
    void updateStartTime(Date startTime) {
        if (startTime == null) {
            return;
        }
        final Date accumulatedStartTime =
                earliestKnownStartTime.accumulateAndGet(
                        startTime,
                        (currentStartTime, newStartTime) ->
                            currentStartTime == null || newStartTime.before(currentStartTime)
                                ? newStartTime : currentStartTime
                );
        if (accumulatedStartTime.equals(startTime)) {
            earliestKnownEndTime.set(null);
        }
    }

    /**
     * Updates the latest known end time to be the passed value, unless the latest known end time
     * has been erased by {@link #updateStartTime(Date)}
     *
     * @param endTime
     *            latest known end time that was encountered
     */
    void updateEndTime(Date endTime) {
        earliestKnownEndTime.accumulateAndGet(endTime,
                (currentEndTime, newEndTime) -> currentEndTime == null ? null : newEndTime);
    }

    /**
     * Atomically determines, updates {@link #earliestKnownEndTime} and returns that value for use
     * in the next task query.
     *
     * @return earliest known end time that is used to query for tasks that complete at or after
     *         this time.
     */
    Date getEndTime() {
        return earliestKnownEndTime.updateAndGet(
                (endTime) -> Optional.ofNullable(endTime).orElse(earliestKnownStartTime.get()));
    }
}
