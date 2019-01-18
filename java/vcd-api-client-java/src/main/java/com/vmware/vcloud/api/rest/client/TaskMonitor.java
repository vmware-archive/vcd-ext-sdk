/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client;

import java.util.concurrent.TimeoutException;

import com.vmware.cxfrestclient.JaxRsClient;
import com.vmware.vcloud.api.rest.schema_v1_5.EntityType;
import com.vmware.vcloud.api.rest.schema_v1_5.TaskType;

/**
 * Monitors tasks for success or failure returned by post and put methods in {@link JaxRsClient}.
 */
public interface TaskMonitor {

    /**
     * Waits for task to complete.
     *
     * @param task
     *            task returned by post or put calls.
     * @param timeoutInMillis
     *            time (in milliseconds) to wait for task to finish
     *
     * @return The completed successful task
     *
     * @throws VcdTaskException
     *             exception will be thrown when task completes with an error.
     * @throws TimeoutException
     *             exception thrown when task is not finished within given time.
     */
    TaskType waitForSuccess(final TaskType task, final long timeoutInMillis) throws VcdTaskException,
            TimeoutException;

    /**
     * Waits for task to complete.
     *
     * @param taskHref
     *            href of the task returned via post or put calls.
     * @param timeoutInMillis
     *            time (in milliseconds) to wait for task to finish
     *
     * @return The completed successful task
     *
     * @throws VcdTaskException
     *             exception will be thrown when task completes with an error.
     * @throws TimeoutException
     *             exception thrown when task is not finished within given time.
     */
    TaskType waitForSuccess(final String taskHref, final long timeoutInMillis) throws VcdTaskException,
            TimeoutException;

    /**
     * Waits for task to reach expected status.
     *
     * @param task
     *            task returned by post or put calls.
     * @param timeoutInMillis
     *            time (in milliseconds) to wait for task to finish.
     * @param pollFrequency
     *            time (in milliseconds) with which task will be polled.
     * @param failOnStatus
     *            task will fail if this {@link TaskStatus} is reached. If this parameter is null then
     *            either task will achieve expected target status or throw {@link TimeOutException}.
     * @param expectedTargetStatus
     *            list of expected alternative target status.
     * @return {@link TaskType} from list of expected target status.
     * @throws TimeoutException
     *             exception thrown when task is not finished within given time.
     */
    TaskType waitForStatus(TaskType task, long timeoutInMillis, long pollFrequency, TaskStatus failOnStatus,
            TaskStatus... expectedTargetStatus) throws TimeoutException;

    /**
     * Waits for task to reach expected status.
     *
     * @param taskHref
     *            href of the task returned via post or put calls.
     * @param timeoutInMillis
     *            time (in milliseconds) to wait for task to finish.
     * @param pollFrequency
     *            time (in milliseconds) with which task will be polled.
     * @param failOnStatus
     *            task will fail if this {@link TaskStatus} is reached. If this parameter is null
     *            then either task will achieve expected target status or throw
     *            {@link TimeOutException}.
     * @param expectedTargetStatus
     *            list of expected alternative target status.
     * @return {@link TaskType} from list of expected target status.
     * @throws TimeoutException
     *             exception thrown when task is not finished within given time.
     */
    TaskType waitForStatus(String taskHref, long timeoutInMillis, long pollFrequency,
            TaskStatus failOnStatus, TaskStatus... expectedTargetStatus) throws TimeoutException;

    /**
     * Convenience wrapper over {@link #waitForSuccess(TaskType, long)} that waits on the
     * task that's associated with the specified {@link EntityType}.
     *
     * @param entity
     *          the entity whose task we want to wait on
     * @param timeoutInMillis
     *            time (in milliseconds) to wait for task to finish
     * @return The completed successful task
     *
     * @throws VcdTaskException
     *             exception will be thrown when task completes with an error.
     * @throws TimeoutException
     *             exception thrown when task is not finished within given time.
     * @throws IllegalStateException
     *             exception will be thrown if there's not exactly one task for the entity
     */
    TaskType waitForSuccess(final EntityType entity, final long timeoutInMillis) throws TimeoutException;
}
