# VCD UI Theme Generator #
This is a utility for creating new themes (CSS files) that are compatible with the vCloud Director user interfaces by leveraging the theme support built into [Clarity](https://github.com/vmware/clarity) v0.10.17* and above, and by prescribing patterns to override styles not directly modifiable through Clarity's theme support.

> **Note: This utility creates themes that are compatible with vCloud Director version 9.5 and above.  Custom themes are not supported in versions < 9.5.**

## Overview ##
The goal of this utility is to provide an easy way for providers to brand their vCD user interface.  The most common ways to promote a visual brand are through the use of a color palette and through images/logos.  Using variables in a visual framework to define colors, and overriding those variables is a popular solution for customization in many UI libraries today, and it is a technique that the Clarity library has now adopted.

By leveraging a tool (this tool) that can process the Sass Clarity definitions alongside variable overrides and selector overrides in a specific way, providers can quickly and easily create a drop in replacement for the default vCD style sheet.

## Getting Started ##
### Install ###
```bash
git clone https://github.com/vmware/vcd-ext-sdk.git
cd vcd-ext-sdk/ui/theme-generator

# install project dependencies
yarn
```

### Build Theme ###
This project ships with a sample theme override, Clarity's dark theme.  To generate the CSS for it, simply run:
```bash
yarn build --theme dark
```

This will produce a `dark.css` file in the `css/` folder.  One or more themes can be managed as directories under the `src/` folder.  Any folder with valid Sass content can be used as the `--theme` parameter value in the above build command.

Calling the above command with no params will print usage information:

```
build-theme [options]

Generates a CSS file with specified overrides applied to base Clarity styles

Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  --theme, -t     Theme directory to generate CSS for        [string] [required]
  --optimize, -o  Whether or not to optimize and minimize the generated CSS
                                                      [boolean] [default: false]

Missing required argument: theme
```

### Theme Folder Structure ###
Each theme folder under `src` should contain the following files:
* styles.scss
* _variables.scss
* _selectors.scss

The `styles.scss` file does not need to be modified.  It ensures that the Sass pieces are built in the appropriate order to override default colors and styles with custom versions.

The `_variables.scss` is a mapping of all the variables that can be overridden in Clarity.  It looks a little overwhelming at first, but it is organized by visual components, and colors can often be overridden by doing a find and replace based on hex values of the default colors.

The `_selectors.scss` file is for style overrides that can't be constrained to color variables.  The login selectors are the most commonly requested for modification.  Sass (or vanilla CSS) can be used here to achieve additional levels of branding, like changing the logo on the login page:
```css
.login-wrapper {
    display: flex;
    background: url(https://www.example.com/assets/some-cool-image.png);
    background-size: 50vw;
    background-position: right;
    background-repeat: no-repeat;
    
    .login {
        background: #1b3541;
        position: relative;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        padding: 1rem 2.5rem;
        height: auto;
        min-height: 100vh;
        width: 21rem;
        
        .title {
            color: #ffffff;
            font-weight: 200;
            font-size: 1.33333rem;
            letter-spacing: normal;
            line-height: 1.5rem;
        }
    }
}
```
