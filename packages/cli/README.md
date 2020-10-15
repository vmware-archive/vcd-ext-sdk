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
@vcd/ext-cli/0.0.9 darwin-x64 node-v12.18.4
$ vcd-ext --help [COMMAND]
USAGE
  $ vcd-ext COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`vcd-ext build`](#vcd-ext-build)
* [`vcd-ext deploy [NAME]`](#vcd-ext-deploy-name)
* [`vcd-ext help [COMMAND]`](#vcd-ext-help-command)
* [`vcd-ext login [ALIAS] [BASEPATH] [USERNAME] [PASSWORD]`](#vcd-ext-login-alias-basepath-username-password)
* [`vcd-ext new [NAME]`](#vcd-ext-new-name)
* [`vcd-ext pack [NAME]`](#vcd-ext-pack-name)
* [`vcd-ext serve`](#vcd-ext-serve)

## `vcd-ext build`

compile the project from TS to JSON

```
USAGE
  $ vcd-ext build

OPTIONS
  -h, --help              Provides usage for the current command
  --additionalProperties  Controls whether or not additionalProperties will be allowed or not.

EXAMPLE
  $ vcd-ext build
```

## `vcd-ext deploy [NAME]`

Deploys extensibility entities to previously logged in vCD instance. If a file is provided it deployes from the file, otherwise it needs to be run in the context of a solution projects.

```
USAGE
  $ vcd-ext deploy [NAME]

OPTIONS
  -f, --force  If provided it will first try to remove all objects if present and recreated them.
  -h, --help   Provides usage for the current command.
  --only=only  Comma separated list of subcomponent names to be deployed. If not provided it deployes all subcomponents.

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

## `vcd-ext login [ALIAS] [BASEPATH] [USERNAME] [PASSWORD]`

Logs into Cloud Director and stores the session

```
USAGE
  $ vcd-ext login [ALIAS] [BASEPATH] [USERNAME] [PASSWORD]

ARGUMENTS
  ALIAS     Alias for stroing the session token
  BASEPATH  Cloud director URL https://<host>[:<port>]/cloudapi
  USERNAME  Username in the form of <user>[@<tenant>]. If @<tenant> is omitted System tenant will be used.
  PASSWORD  Password for the user

OPTIONS
  -h, --help  Provides usage for the current command.

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

Packages the contents of the solution project into a CARE package. File name can be provided as optional parameter.

```
USAGE
  $ vcd-ext pack [NAME]

ARGUMENTS
  NAME  Optional archive name

OPTIONS
  -h, --help  Provides usage for the current command.

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
  -h, --help  Provides usage for the current command.

EXAMPLE
  $ vcd-ext serve
```
<!-- commandsstop -->
