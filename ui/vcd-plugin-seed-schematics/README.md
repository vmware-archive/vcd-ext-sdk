# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

# How it works

```bash
cd vcd-ext-sdk/ui/vcd-plugin-seed-schematics
npm i

# Build schematics
npm run build

# Create UI plugin for vCloud Director version 9.1
schematics .:plugin-seed --debug=false

# You will be prompted to enter some details
# What is the name of your plugin? <ENTER PLUGIN NAME>
# For which vCloud Director version? <ENTER VCD VERSION>
```

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!