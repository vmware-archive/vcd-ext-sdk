/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import com.vmware.cxfrestclient.JaxRsClient;
import com.vmware.vcloud.api.rest.schema_v1_5.EntityType;
import com.vmware.vcloud.api.rest.schema_v1_5.TaskType;
import com.vmware.vcloud.api.rest.schema_v1_5.TasksInProgressType;

import org.apache.commons.lang3.time.StopWatch;

public class TaskMonitorImpl implements TaskMonitor {

    private final JaxRsClient client;
    private static final long DEFAULT_POLL_MS = TimeUnit.MILLISECONDS.convert(5, TimeUnit.SECONDS);

    public TaskMonitorImpl(final JaxRsClient client) {
        this.client = client;
    }

    @Override
    public TaskType waitForSuccess(final TaskType task, final long timeoutInMillis) throws TimeoutException {
        return waitForStatus(task, timeoutInMillis, DEFAULT_POLL_MS, TaskStatus.ERROR, TaskStatus.SUCCESS);
    }

    @Override
    public TaskType waitForSuccess(final String taskHref, final long timeoutInMillis) throws TimeoutException {
        return waitForStatus(taskHref, timeoutInMillis, DEFAULT_POLL_MS, TaskStatus.ERROR, TaskStatus.SUCCESS);
    }

    @Override
    public TaskType waitForSuccess(final EntityType entity, final long timeoutInMillis) throws TimeoutException {
        TasksInProgressType tasks = entity.getTasks();
        if (tasks.getTask().size() != 1) {
            throw new IllegalStateException("Entity doesn't have exactly one task");
        }
        TaskType task = tasks.getTask().get(0);
        return waitForSuccess(task, timeoutInMillis);
    }

    @Override
    public TaskType waitForStatus(TaskType task, long timeoutInMillis, long pollFrequency,
            TaskStatus failOnStatus, TaskStatus... expectedTargetStatus) throws TimeoutException {
        final String taskHref = task.getHref();
        return waitForStatus(taskHref, timeoutInMillis, pollFrequency, failOnStatus, expectedTargetStatus);
    }

    @Override
    public TaskType waitForStatus(String taskHref, long timeoutInMillis, long pollFrequency,
            TaskStatus failOnStatus, TaskStatus... expectedTargetStatus) throws TimeoutException {
        final StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        while (true) {

            final TaskType taskType = getTaskStatus(taskHref);

            for (final TaskStatus status : expectedTargetStatus) {
                if (taskType.getStatus().equalsIgnoreCase(status.toString())) {
                    return taskType;
                } else if (failOnStatus != null
                        && taskType.getStatus().equalsIgnoreCase(failOnStatus.toString())) {

                    throw new VcdTaskException(taskType.getOwner(), String.format(
                            "Expected task status %s but got %s",
                            createTaskStatusString(expectedTargetStatus), taskType.getStatus()),
                            taskType.getError());
                }
            }

            if (stopWatch.getTime() >= timeoutInMillis) {
                stopWatch.stop();
                break;
            }

            try {
                Thread.sleep(pollFrequency);
            } catch (final InterruptedException e) {
                throw new RuntimeException("Polling was interrupted", e);
            }
        }

        final long waitInSeconds = TimeUnit.MILLISECONDS.toSeconds(stopWatch.getTime());

        throw new TimeoutException("Timed out after " + waitInSeconds
                + " seconds waiting for task: " + taskHref);
    }

    private String createTaskStatusString(TaskStatus... taskStatus) {
        final StringBuffer sb = new StringBuffer();

        for (final TaskStatus task : taskStatus) {
            sb.append(task.toString());
            sb.append(", ");
        }

        return sb.toString();
    }

    private TaskType getTaskStatus(final String taskHref) {
        return client.getResource(makeUri(taskHref), TaskType.class);
    }

    private static URI makeUri(final String uriString) {
        try {
            return new URI(uriString);
        } catch (final URISyntaxException e) {
            throw new RuntimeException("Can't build URI from resource href: " + uriString);
        }
    }
}
