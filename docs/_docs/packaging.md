---
layout: default
title: Packaging
category: none7
catOrder: 7
hasMore: true
order: 7
permalink: /docs/packaging
---
# Packaging a solution
While developing you will probably run the solution into an emulated environment to speed up the development process. But when the time comes to distribute to your users and deploy the solution an Cloud Director instance the solution needs to be packaged in an appropriate form.

## CARE Package
The form factor of a solution is the [CARE Package]({{ site.baseurl }}/architecture/care_package/overview). Once all sub-projects are built the whole solution can be packaged into a CARE Package. The CARE package is an archive which contains all deployable elements and an manifest describing the contents.

## Creating a CARE Package
### Through NPM
Run the following command in the root of the project to generate a CARE package.
```bash
npm run package
```
Once the command finishes new file should be present in the `dist` folder with `.care` file extension.

### Through the CLI directly
Alternatively the `vcd-ext` CLI can be used directly to create a CARE package. As opposite to running the `npm run package` script only from within the root of the project, the `vcd-ext pack` can be run from anywhere within the project.
```bash
npm run package
```

### Specify a custom name
By default the command uses the name of the solution as specified in the `package.json` as a name of the newly generated CARE package. This can be overridden by providing the custom name as an argument. This can be useful in a CI/CD environments, where usually the build number is part of the produced artifact.
```bash
npm run package -- myCustomName
```

### Create a partial package
As all CLI command `vcd-ext pack` does accept `--only=` argument, which allows you to create a package containing only the sub-projects provided as a comma separated list.
```bash
vcd-ext pack --only=types
```
