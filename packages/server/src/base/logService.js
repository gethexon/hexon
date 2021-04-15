const log4js = require('log4js')
const path = require('path')
const fs = require('fs')
const {
  isDev
} = require('../util/common')
/**
 * 日志目录
 */
const LOG_FOLDER = path.resolve(process.cwd(), 'log')
const getLogfilePath = filename => {
  return path.resolve(LOG_FOLDER, filename)
}
if (!fs.existsSync(LOG_FOLDER)) {
  fs.mkdirSync(LOG_FOLDER)
}
function error (message) {
  const err = new Error(message)
  err.name = 'LogService'
  throw err
}
class LogDescriptor {
  constructor (key, seprate = true, file = true, console = true) {
    if (!key || typeof key !== 'string')error('key must be not null string')
    this.key = key
    this.console = console
    this.file = file
    this.seprate = seprate
  }
}
exports.LogDescriptor = LogDescriptor
class LogService {
  constructor () {
    this._descriptors = new Map()
    this._loggers = new Map()

    // #region register loggers
    this.register(new LogDescriptor('http'))
    this.register(new LogDescriptor('di'))
    this.register(new LogDescriptor('server'))
    this.register(new LogDescriptor('auth'))
    this.register(new LogDescriptor('hexo'))
    this.register(new LogDescriptor('installer', false))
    // #endregion

    // #region update log4js configuration
    const appenders = { ...LogService.baseAppenders }
    const categories = { ...LogService.baseCategories }
    this._descriptors.forEach(descriptor => {
      if (descriptor.file) {
        appenders[descriptor.key] = {
          type: 'file',
          filename: getLogfilePath(descriptor.key + '.log'),
          removeColor: true
        }
      }
      const appender = []
      if (descriptor.console) appender.push('console')
      appender.push('all')
      if (descriptor.file) {
        if (descriptor.seprate)appender.push(descriptor.key)
        else appender.push('default')
      }
      categories[descriptor.key] = {
        appenders: appender,
        level: isDev ? 'debug' : 'info'
      }
    })
    log4js.configure({ appenders, categories })
    // #endregion

    this._descriptors.forEach(descriptor => {
      this._loggers.set(descriptor.key, log4js.getLogger(descriptor.key))
    })
  }

  register (descriptor) {
    if (this._descriptors.has(descriptor.key))error(`logger ${descriptor.key} in use`)
    if (['defulat', 'all', 'logservice'].includes(descriptor.key)) {
      error('restricted key: ' + descriptor.key)
    }
    this._descriptors.set(descriptor.key, descriptor)
  }

  get (key) {
    if (!key) error('key is required')
    if (!this._descriptors.has(key)) error(`logger ${key} not found`)
    return this._loggers.get(key)
  }
}
LogService.baseAppenders = {
  default: {
    type: 'file',
    filename: getLogfilePath('default.log'),
    removeColor: true
  },
  all: {
    type: 'file',
    filename: getLogfilePath('all.log'),
    removeColor: true
  },
  console: {
    type: 'console',
    layout: {
      type: 'pattern',
      pattern: '%[[%d{hh:mm:ss.SSS}][%c][%p]%] %m'
    }
  }
}
LogService.baseCategories = {
  default: {
    appenders: ['console', 'all', 'default'],
    level: isDev ? 'debug' : 'info'
  }
}
exports.LogService = LogService

const ILogService = 'ILogService'
exports.ILogService = ILogService
