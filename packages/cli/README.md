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
@vcd/ext-cli/0.0.1 darwin-x64 node-v13.7.0
$ vcd-ext --help [COMMAND]
USAGE
  $ vcd-ext COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`vcd-ext build`](#vcd-ext-build)
* [`vcd-ext deploy`](#vcd-ext-deploy)
* [`vcd-ext help [COMMAND]`](#vcd-ext-help-command)
* [`vcd-ext login [ALIAS] [BASEPATH] [USERNAME] [PASSWORD]`](#vcd-ext-login-alias-basepath-username-password)
* [`vcd-ext new [NAME]`](#vcd-ext-new-name)

## `vcd-ext build`

compile the project from TS to JSON

```
USAGE
  $ vcd-ext build

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ vcd-ext build
```

## `vcd-ext deploy`

Deploys extensibility entities to previously logged in vCD instance

```
USAGE
  $ vcd-ext deploy

OPTIONS
  -f, --force
  -h, --help   show CLI help

EXAMPLE
  $ vcd-ext deploy
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

## `vcd-ext login [ALIAS] [BASEPATH] [USERNAME] [PASSWORD]`

Logs into Cloud Director and stores the session

```
USAGE
  $ vcd-ext login [ALIAS] [BASEPATH] [USERNAME] [PASSWORD]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ vcd-ext login <alias> <basePath> <username> <password>
```

## `vcd-ext new [NAME]`

create new project

```
USAGE
  $ vcd-ext new [NAME]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ vcd-ext new ticketing
```
<!-- commandsstop -->
