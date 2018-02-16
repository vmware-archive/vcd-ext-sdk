/* ********************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *******************************************************************************/

package com.vmware.vcloud.api.rest.client;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;


/**
 * The status of a task
 *
 * Note: This Enum is clone of {@link com.vmware.vcloud.api.presentation.entity.common.TaskStatus}.
 * It is cloned in-order to avoid rest-client dependency on presentation layer.
 */

public enum TaskStatus {
    /**
     * The task has been queued for execution
     */
    PENDING("pending"),

    /**
     * The task is assigned for pre-processing
     */
    PRE_RUNNING("pre-running"),

    /**
     * The task is running
     */
    RUNNING("running"),

    /**
     * The task completed successfully
     */
    SUCCESS("success"),

    /**
     * The task was aborted
     */
    ABORTED("aborted"),

    /**
     * The task completed with an error. The {@link TaskSpec#error} field would
     * be set with information about the error
     */
    ERROR("error"),

    /**
     * The task was canceled.
     */
    CANCELED("canceled");

    private static final Map<String, TaskStatus> REVERSE_LOOKUP_MAP;
    static {
        final Map<String, TaskStatus> reverseLookupMap =
                Stream.of(TaskStatus.values()).collect(Collectors.toMap(TaskStatus::getLabel, ts -> ts));

        REVERSE_LOOKUP_MAP = Collections.unmodifiableMap(reverseLookupMap);
    }

    private final String label;

    TaskStatus(String label) {
        this.label = label;
    }

    /**
     * Getter for {@link TaskStatus#label}
     */
    public String getLabel() {
        return label;
    }

    /**
     * @see java.lang.Enum#toString()
     */
    @Override
    public String toString() {
        return getLabel();
    }

    public static TaskStatus from(String s) {
        final Optional<TaskStatus> ts = Optional.ofNullable(REVERSE_LOOKUP_MAP.get(s));
        return ts.orElseThrow(IllegalArgumentException::new);
    }
}

