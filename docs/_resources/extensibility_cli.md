---
layout: default
title:  "Extensibility CLI"
category: References
catOrder: 1
hasMore: true
order: 1
permalink: /resources
---
@vcd/ext-cli
==========

CLI tool for working with Cloud Director extensions

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@vcd/ext-cli.svg)](https://npmjs.org/package/@vcd/ext-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@vcd/ext-cli.svg)](https://npmjs.org/package/@vcd/ext-cli)
[![License](https://img.shields.io/npm/l/@vcd/ext-cli.svg)](https://github.com/plugins/cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @vcd/ext-cli
$ vcd-ext COMMAND
running command...
$ vcd-ext (-v|--version|version)
@vcd/ext-cli/0.0.12-alpha.8 darwin-x64 node-v12.18.4
$ vcd-ext --help [COMMAND]
USAGE
  $ vcd-ext COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`vcd-ext analytics SETTING`](#vcd-ext-analytics-setting)
* [`vcd-ext build`](#vcd-ext-build)
* [`vcd-ext deploy [NAME]`](#vcd-ext-deploy-name)
* [`vcd-ext help [COMMAND]`](#vcd-ext-help-command)
* [`vcd-ext login ALIAS BASEPATH USERNAME [PASSWORD]`](#vcd-ext-login-alias-basepath-username-password)
* [`vcd-ext new [NAME]`](#vcd-ext-new-name)
* [`vcd-ext pack [NAME]`](#vcd-ext-pack-name)
* [`vcd-ext serve`](#vcd-ext-serve)
* [`vcd-ext subscribe TOPIC`](#vcd-ext-subscribe-topic)
* [`vcd-ext use [ALIAS]`](#vcd-ext-use-alias)

## `vcd-ext analytics SETTING`

Configures the gathering of usage metrics

```
USAGE
  $ vcd-ext analytics SETTING

ARGUMENTS
  SETTING  The value of the setting is one of the following:
           * 'on'     - enables analytics gathering and reporting for the current user.
           * 'off'    - disables analytics gathering and reporting for the current user.
           * 'prompt' - Prompts the user to set the status interactively.

OPTIONS
  -h, --help  Provides usage for the current command.

EXAMPLE
  $ vcd-ext analytics <on|off|prompt>
```

## `vcd-ext build`

builds the elements of a CARE package for which custom build is defined

```
USAGE
  $ vcd-ext build

OPTIONS
  -h, --help   Provides usage for the current command
  --ci         Indicates the command is run within CI environment. It skips analytics consent prompt.
  --only=only  Comma separated list of element names to be deployed. If not provided it deployes all elements.

EXAMPLE
  $ vcd-ext build
```

## `vcd-ext deploy [NAME]`

Deploys extensibility entities to previously logged in vCD instance.

```
USAGE
  $ vcd-ext deploy [NAME]

OPTIONS
  -f, --force  If provided it will first try to remove all objects if present and recreated them.
  -h, --help   Provides usage for the current command.
  --ci         Indicates the command is run within CI environment. It skips analytics consent prompt.
  --only=only  Comma separated list of subcomponent names to be deployed. If not provided it deployes all subcomponents.

DESCRIPTION
  If a file is provided it deployes from the file, otherwise it needs to be run in the context of a solution projects.

EXAMPLES
  $ vcd-ext deploy
  $ vcd-ext deploy mysolution.care
```

## `vcd-ext help [COMMAND]`

display help for vcd-ext

```
USAGE
  $ vcd-ext help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `vcd-ext login ALIAS BASEPATH USERNAME [PASSWORD]`

Logs into Cloud Director and stores the session

```
USAGE
  $ vcd-ext login ALIAS BASEPATH USERNAME [PASSWORD]

ARGUMENTS
  ALIAS     Alias for stroing the session token
  BASEPATH  Cloud director URL https://<host>[:<port>]/cloudapi
  USERNAME  Username in the form of <user>[@<tenant>]. If @<tenant> is omitted System tenant will be used.
  PASSWORD  Password for the user

OPTIONS
  -h, --help  Provides usage for the current command.
  --ci        Indicates the command is run within CI environment. It skips analytics consent prompt.

EXAMPLE
  $ vcd-ext login <alias> <basePath> <username> <password>
```

## `vcd-ext new [NAME]`

Creates a new project in the folder provided as a name

```
USAGE
  $ vcd-ext new [NAME]

ARGUMENTS
  NAME  Project name

OPTIONS
  -h, --help  Provides usage for the current command.

EXAMPLE
  $ vcd-ext new ticketing
```

## `vcd-ext pack [NAME]`

Packages the contents of the solution project into a CARE package.

```
USAGE
  $ vcd-ext pack [NAME]

ARGUMENTS
  NAME  Optional archive name

OPTIONS
  -h, --help   Provides usage for the current command.
  --ci         Indicates the command is run within CI environment. It skips analytics consent prompt.
  --only=only  Comma separated list of element names to be packed. If not provided it packs all elements.

DESCRIPTION
  File name can be provided as optional parameter.

EXAMPLES
  $ vcd-ext pack
  $ vcd-ext pack mypackagename.zip
```

## `vcd-ext serve`

Serves an emulated environmnet

```
USAGE
  $ vcd-ext serve

OPTIONS
  -h, --help   Provides usage for the current command.
  --only=only  Comma separated list of element names to be served. If not provided it serves all elements.

EXAMPLE
  $ vcd-ext serve
```

## `vcd-ext subscribe TOPIC`

Subscribes to a mqtt topic and starts to listen to messages

```
USAGE
  $ vcd-ext subscribe TOPIC

ARGUMENTS
  TOPIC  Topic to subscribe to in MQTT notation (+ single level wildcard, # multi level wildcard)

OPTIONS
  -h, --help  Provides usage for the current command.

EXAMPLE
  $ vcd-ext subscribe <topic>
```

## `vcd-ext use [ALIAS]`

Switch to previously configured session

```
USAGE
  $ vcd-ext use [ALIAS]

ARGUMENTS
  ALIAS  Alias for the session token to switch to

OPTIONS
  -h, --help  Provides usage for the current command.

EXAMPLE
  $ vcd-ext use <alias>
```
<!-- commandsstop -->
