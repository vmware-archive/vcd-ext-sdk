/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client.impl.tasks;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.xml.datatype.XMLGregorianCalendar;

import com.vmware.vcloud.api.rest.client.QueryResultFormat;
import com.vmware.vcloud.api.rest.client.TaskStatus;
import com.vmware.vcloud.api.rest.client.VcdClient;
import com.vmware.vcloud.api.rest.client.VcdClient.Query;
import com.vmware.vcloud.api.rest.client.VcdTaskMonitor.MultiTaskTracker;
import com.vmware.vcloud.api.rest.schema_v1_5.QueryResultAdminTaskRecordType;
import com.vmware.vcloud.api.rest.schema_v1_5.QueryResultRecordType;
import com.vmware.vcloud.api.rest.schema_v1_5.QueryResultTaskRecordType;
import com.vmware.vcloud.api.rest.schema_v1_5.TaskType;

import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.search.client.SearchConditionBuilder;

/**
 * An implementation of {@link MultiTaskTracker} that tracks tasks that complete AFTER the instant
 * of earliest known start time of all tasks being tracked by this instance.
 * <P>
 * Task tracking is achieved by querying VCD via the {@code task} query every
 * {@value #POLLING_INTERVAL_SECS} seconds for the operations of various tasks being tracked and
 * have completed. As completed task id's trickle in, the time threshold for future queries changes
 * from the earliest known start time of all tasks to the latest known time of completed tasks thus
 * allowing to further optimize the queries and processing of results by de-duplication.
 *
 * @since 8.10
 */
class VcdBulkTaskMonitor implements MultiTaskTracker {
    private static final long POLLING_INTERVAL_SECS = 15L;

    private final ScheduledExecutorService periodicExecutor = Executors.newSingleThreadScheduledExecutor();

    private final Set<String> taskIds = new HashSet<String>();
    private final Map<String, TaskStatus> taskCompletionStatus = new ConcurrentHashMap<>();

    private final Query<? extends QueryResultRecordType> taskQuery;

    private final TaskTimingInfo taskTimingInfo = new TaskTimingInfo();

    private final CompletableFuture<Map<String, TaskStatus>> trackingFuture =
            new CompletableFuture<Map<String,TaskStatus>>();

    private final AtomicBoolean allTasksAdded = new AtomicBoolean(false);

    VcdBulkTaskMonitor(final VcdClient vcdClient) {
        taskQuery = StringUtils.equalsIgnoreCase(vcdClient.getLoggedInOrg().getName(), "system")
                ? vcdClient.getQuery("adminTask", QueryResultAdminTaskRecordType.class)
                        : vcdClient.getQuery("task", QueryResultTaskRecordType.class);

        taskQuery.setQueryResultFormat(QueryResultFormat.ID_RECORDS)
            .setPageSize(Query.DEFAULT_MAX_PAGE_SIZE)
            .setSortAsc("endDate");

        periodicExecutor.scheduleWithFixedDelay(
                () -> run(), POLLING_INTERVAL_SECS, POLLING_INTERVAL_SECS, TimeUnit.SECONDS);

        trackingFuture.whenComplete(this::finishTracking);
    }

    private final void finishTracking(Map<String, TaskStatus> result, Throwable ex) {
        periodicExecutor.shutdown();
    }

    private void run() {
        final Date lastKnownEndTime = taskTimingInfo.getEndTime();
        if (lastKnownEndTime == null) {
            // no tasks have been added. Skip.
            if (allTasksAdded.get()) {
                // No tasks will be added. So finish up.
                trackingFuture.complete(Collections.emptyMap());
            }
            return;
        }
        final String filter = generateQueryString(lastKnownEndTime);

        final AtomicReference<Date> latestTimeRecorded = new AtomicReference<>(lastKnownEndTime);

        try {
            taskQuery.setFilter(filter).stream()
                // ignore tasks already known to be complete
                .filter(task -> !taskCompletionStatus.containsKey(task.getId()))
                // Update time threshold to time of last task's completion.
                // Since results are sorted by 'endTime' ascending, last record is the
                // task that ended the latest among the tasks retrieved in this set of results.
                .peek(task ->
                          latestTimeRecorded.set(extractEndDate(task).toGregorianCalendar().getTime()))
                .collect(Collectors.toMap(
                             QueryResultRecordType::getId,
                             task -> TaskStatus.from(extractStatus(task)),
                             // Safety de-dup. existingTaskStatus and newTaskStatus should be the same
                             // as per our data model and duplicate tasks filtered out above.
                             (existingTaskStatus, newTaskStatus) -> existingTaskStatus,
                             () -> taskCompletionStatus));
        } catch (RuntimeException e) {
            trackingFuture.completeExceptionally(e);
            throw e;
        }

        taskTimingInfo.updateEndTime(latestTimeRecorded.get());

        // Determine if we are done based on whether all tasks have been added
        // and we have recorded status's of all those tasks.
        if (allTasksAdded.get() && taskCompletionStatus.keySet().containsAll(taskIds)) {
            taskCompletionStatus.keySet().retainAll(taskIds);
            trackingFuture.complete(Collections.unmodifiableMap(taskCompletionStatus));
        }
    }

    private String generateQueryString(final Date lastKnownEndTime) {
        final SearchConditionBuilder taskFilter = Query.getFilterBuilder();
        return taskFilter.is("endDate").notBefore(lastKnownEndTime)
                .and("status").equalTo(TaskStatus.SUCCESS.getLabel(),
                                       TaskStatus.ERROR.getLabel(),
                                       //TaskStatus.CANCELED.getLabel(),
                                       TaskStatus.ABORTED.getLabel()).wrap()
                .query();
    }

    private XMLGregorianCalendar extractEndDate(final QueryResultRecordType task) {
        if (task instanceof QueryResultAdminTaskRecordType) {
            return ((QueryResultAdminTaskRecordType)task).getEndDate();
        } else if (task instanceof QueryResultTaskRecordType) {
            return ((QueryResultTaskRecordType)task).getEndDate();
        } else {
            throw new AssertionError("Returned result objects are not of task/adminTask result types");
        }
    }

    private String extractStatus(final QueryResultRecordType task) {
        if (task instanceof QueryResultAdminTaskRecordType) {
            return ((QueryResultAdminTaskRecordType)task).getStatus();
        } else if (task instanceof QueryResultTaskRecordType) {
            return ((QueryResultTaskRecordType)task).getStatus();
        } else {
            throw new AssertionError("Returned result objects are not of task/adminTask result types");
        }
    }

    @Override
    public synchronized void track(TaskType... tasks) throws IllegalStateException {
        track(Stream.of(tasks));
    }

    @Override
    public synchronized void track(Collection<TaskType> tasks) throws IllegalStateException {
        track(tasks.stream());
    }

    private void track(Stream<TaskType> tasks) throws IllegalStateException {
        validateState();
        tasks
            .peek(task -> taskTimingInfo.updateStartTime(task.getStartTime().toGregorianCalendar().getTime()))
            .collect(Collectors.mapping(TaskType::getId, Collectors.toCollection(() -> this.taskIds)));
    }

    private void validateState() {
        if (allTasksAdded.get()) {
            throw new IllegalStateException("Multi task monitor cannot track more tasks");
        }
    }

    @Override
    public Future<Map<String, TaskStatus>> toTrackingFuture() {
        allTasksAdded.set(true);
        return trackingFuture;
    }
}
