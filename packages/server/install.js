require('./src/init')
require('./src/base')
require('./src/install/config')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { spawn } = require('hexo-util')
const inquirer = require('inquirer')
const DI = require('./src/util/di')
const { IConfigService } = require('./src/base/configService')
const { InstallConfig } = require('./src/install/config')
const { checkIsBlog } = require('./src/hexo/core/util')
const HexoConfig = require('./src/hexo/core/config')
const configStorage = DI.inject(IConfigService)
class Printer {
  constructor (prefix) {
    this.prefix = prefix
  }

  printSection (name) {
    console.log()
    console.log(chalk.blue.bold('⚙ ' + name))
    console.log()
  }

  log () {
    console.log(...arguments)
  }

  printEmptyLine () {
    console.log()
  }

  success () {
    console.log(chalk.green(`[${this.prefix || 'SUCCESS'}]`), ...arguments)
  }

  info () {
    console.log(chalk.blue(`[${this.prefix || 'INFO'}]`), ...arguments)
  }

  warn () {
    console.log(chalk.yellow(`[${this.prefix || 'WARN'}]`), ...arguments)
  }

  error () {
    console.log(chalk.red(`[${this.prefix || 'ERROR'}]`), ...arguments)
  }

  clear () {
    console.clear(...arguments)
  }
}
function readJsonFile (filename) {
  const file = fs.readFileSync(filename)
  return JSON.parse(file)
}
const printer = new Printer()
async function run (command, args) {
  try {
    await spawn(command, args, { stdio: 'inherit' })
    return false
  } catch (err) {
    printer.error(
      'Failed:',
      [command]
        .concat(args)
        .map((i) => {
          return i.includes(' ') ? `"${i}"` : i
        })
        .join(' ')
    )
    printer.error(err)
    return true
  }
}
const logo = fs.readFileSync('./logo.art', 'utf-8')
async function install () {
  printer.clear()
  printer.log(chalk.blue.bold(logo, 'by winwin_2011 with ❤️'))

  printer.printSection('Check Version')
  const oldVersion = readJsonFile('./package.json').version
  printer.info('Current Version ' + oldVersion)
  if (oldVersion.indexOf('-') >= 0) {
    printer.warn('This is a preview version!')
  }

  printer.printSection('Fetch Submodules')
  await run('git', ['submodule', 'sync'])
  await run('git', ['submodule', 'update', '--init', '--recursive'])

  printer.printSection('Configuation')
  const portPrompt = {
    name: 'port',
    message: 'Which port do you like Hexon running at?',
    default: 5777,
    validate (v) {
      return !isNaN(v) || `number is required ${typeof v} given`
    },
    prefix: chalk.blue('?')
  }
  const hexoRootPrompt = {
    name: 'hexoRoot',
    message: 'Your hexo blog path?',
    validate (v) {
      const truePath = path.resolve(process.cwd(), v)
      try {
        return checkIsBlog(truePath) || chalk.red.bold(truePath) + chalk.red(' is not a valid hexo blog. Please try another.')
      } catch (e) {
        console.error(e)
        return chalk.red('Fail to check path ' + chalk.bold(truePath))
      }
    }
  }
  const answer1 = await inquirer.prompt([portPrompt, hexoRootPrompt])
  configStorage.set(InstallConfig.PORT, answer1.port)
  configStorage.set(HexoConfig.HEXO_ROOT, answer1.hexoRoot)

  printer.printSection('Ready to go!')
  const answer2 = await inquirer.prompt([
    {
      name: 'start',
      message: 'Do you want to run `npm run prd` to start Hexon with pm2?',
      default: false,
      type: 'confirm'
    }
  ])
  let error
  if (answer2.start) error = await run('npm', ['run', 'prd'])

  printer.clear()
  printer.log(chalk.green.bold('Finished!'))
  printer.log()
  if (error) {
    printer.log(
      chalk.yellow(
        'It seems that we have trouble starting Hexon. You need to start mannuly'
      )
    )
    printer.log()
  }
  printer.log('Run ' + chalk.blue.bold('`npm start`') + ' to start with node')
  printer.log('Run ' + chalk.blue.bold('`npm run prd`') + ' to start with pm2')
  printer.log('Run ' + chalk.blue.bold('`npm run stop`') + ' to stop')
  printer.log('Run ' + chalk.blue.bold('`npm run restart`') + ' to restart')
  printer.log()
  printer.log(chalk.green.bold('Remember to finish the following steps:'))
  printer.log(chalk.blue.bold(' 1. (Re)Start Hexon manually!'))
  printer.log(chalk.blue.bold(' 2. Finish installation via your browser'))
  printer.log('Have fun :p')
  printer.log(chalk.grey('For uninstall:'))
  printer.log(chalk.grey('- Remove the following folder: ' + process.cwd()))
  printer.log(chalk.grey('- Stop Hexon manually.'))
}
install()
