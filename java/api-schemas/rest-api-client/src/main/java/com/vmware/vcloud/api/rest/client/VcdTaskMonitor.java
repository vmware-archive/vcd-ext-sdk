/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.Future;

import com.vmware.vcloud.api.rest.schema_v1_5.TaskType;


/**
 * VCD specific enhancement for {@link TaskMonitor}.
 *
 * @since   8.10
 */
public interface VcdTaskMonitor extends TaskMonitor {
    /**
     * A monitor for many tasks that will eventually report the final {@link TaskStatus} of each
     * task identified by the task {@code URN}
     * <P>
     * Tasks to track can be added at any time until it is indicated to the tracker that all tasks
     * have been added and a tracking {@link Future} is requested. At that time, the tracker will
     * begin reconciling the results and make them available when all added tasks have completed and
     * their final results know via the tracking {@link Future}.
     *
     * @since 8.10
     */
    public interface MultiTaskTracker {
        /**
         * Add a list of tasks for the monitor to track.
         * <P>
         * Tasks may be added until {@link #toTrackingFuture()} is called to indicate that no more
         * tasks will be added to this tracker.
         *
         * @param tasks
         *            List of Tasks to be tracked
         * @throws IllegalStateException
         *             if {@link #toTrackingFuture()} has been called.
         */
        void track(TaskType... tasks) throws IllegalStateException;

        /**
         * Add a list of tasks for the monitor to track.
         * <P>
         * Tasks may be added until {@link #toTrackingFuture()} is called to indicate that no more
         * tasks will be added to this tracker.
         *
         * @param tasks
         *            List of Tasks to be tracked
         * @throws IllegalStateException
         *             if {@link #toTrackingFuture()} has been called.
         */
        void track(Collection<TaskType> tasks) throws IllegalStateException;

        /**
         * Indicate to the tracker that all tasks desirous to be tracked have been added to the
         * tracker.
         * <P>
         * This will signal to the tracker to begin final reconciliation of the results.
         *
         * @return a {@link Future} representing the {@link MultiTaskTracker}'s activities. When
         *         completion state of all status's is known the {@code Future} will be updated to
         *         return a {@link Map} of {@code task id's} to {@link TaskStatus}. Canceling the
         *         {@code Future} will stop the underlying tracking.
         */
        Future<Map<String, TaskStatus>> toTrackingFuture();
    }

    /**
     * Get a new instance of {@link MultiTaskTracker} that will track all tasks that complete after this call.
     *
     * @return a new instance of {@link MultiTaskTracker}
     */
    MultiTaskTracker getMultiTaskTracker();
}
