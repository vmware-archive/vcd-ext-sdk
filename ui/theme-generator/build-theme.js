const Ccss = require('clean-css')
const fs = require('fs')
const sass = require('node-sass')
const args = require('yargs')

const argv = args.usage('$0 [options]', 'Generates a CSS file with specified overrides applied to base Clarity styles')
  .options({
    'theme': {
      alias: 't',
      demandOption: true,
      describe: 'Theme directory to generate CSS for',
      type: 'string'
    },
    'optimize': {
      alias: 'o',
      default: false,
      describe: 'Whether or not to optimize and minimize the generated CSS',
      type: 'boolean'
    }
  }).argv

sass.render({
  file: `src/${argv.theme}/styles.scss`
}, function (error, result) {
  if (error) {
    console.log(error.status)
    console.log(error.column)
    console.log(error.message)
    console.log(error.line)
  } else {
    var output = result.css
    if (argv.optimize) {
      const css = new Ccss({
        level: {
          1: {
            specialComments: 1
          },
          2: {
            restructureRules: true
          }
        }
      })

      output = css.minify(output).styles
    }

    if (!fs.existsSync(`${__dirname}/target`)) {
      fs.mkdirSync(`${__dirname}/target`)
    }

    fs.writeFileSync(`target/${argv.theme}.css`, output)
    console.log(`Theme generated as ${fs.realpathSync(`target/${argv.theme}.css`)}`)
  }
})
