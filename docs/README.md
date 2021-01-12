# Documenation site

## Setup
### Prerequisites
* Ruby version 2.4.0 or higher (**NOTE**: Ruby 2.7.2 is required on macOS 10.15).
* RubyGems
* GCC and Make
* Bundler gem installed: 
```
gem install --user-install bundler
```

### Install
```shell
npm install
```

### Start Developing
```shell
npm run start
```

## Structure
The site is organized in [Collections](https://jekyllrb.com/docs/collections/). Each collection is listed in the primary navigation. The root of the collcation is located in the `nav` folder `<collection_name>.md` file. The files in each collection are located in the `_<collection_name>` folder. Each file needs to contain the following front matter:
```yaml
layout: default
title:  "Introduction"
category: Category # collapsable sidenav
order: 1 # order in the sidenav
permalink: /<collection_name>/<file_name>
```