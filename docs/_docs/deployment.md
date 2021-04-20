---
layout: default
title: Deployment
category: none4
catOrder: 6
hasMore: true
order: 2
permalink: /docs/deployment
---
# Deploying a solution
Either during development or when the time comes to deploy in production. The deployment process goes through the sub-projects and attempts to deploy its deliverables. If a deliverable already exists and update is supported, an updated will be performed, if an updated is not supported the an error will be displayed, but the process will not exit and will continue.

## From a solution project
Run the following command anywhere within the project, to deploy all sub-projects described in the `care.json` file. The command will use the previously built deliverables from each sub-project.
```shell
vcd-ext deploy
```

## From a CARE package
If an argument is provided it assumed to be a CARE package. The package is then unpacked and deployment is performed.
```shell
vcd-ext deploy my-solution.care
```

## Forceful deployment
If `-f` argument is provided, the CLI will attempt to clean up before deploying the elements. The clean up process is run in a reverse order then the deployment process.
```bash
vcd-ext deploy my-solution.care -f
```

## Partial deployment
As all CLI command `vcd-ext deploy` does accept `--only=` argument, which allows you to deploy only the sub-projects provided as a comma separated list.
```bash
vcd-ext deploy --only=types
```
