---
layout: default
title:  "Usage Analytics"
category: none2
catOrder: 5
hasMore: true
order: 1
permalink: /architecture/analytics
---
# Gathering of Usage Analytics

Users can opt in to share their Extensibility CLI usage data with VMware through the [CEIP Program](https://www.vmware.com/solutions/trustvmware/ceip.html), during the first use of the CLI or using the `vcd-ext analytics` CLI command.

## CI/CD Environments
In a CI/CD environments the prompting can be disabled by setting the `ENABLE_VCD_SDK_CLI_ANALYTICS` environment variable. If the value of the environment variable is set to `true` collection will be silently performed.

## Collected Information
```typescript
export interface CLIAnalyticsPayload {
    command?: string;       // The command currently being invoked. None if no valid command is found
    errorCode?: string;     // The error code in case of a failure. No stack trace is collected
    os: string;             // The OS on which the CLI runs
    nodeVersion: string;    // The Node version on which the CLI runs
    cliVersion: string;     // The CLI version
    isCIRun?: boolean;      // Whether or not it runs in a CI environment
}
```