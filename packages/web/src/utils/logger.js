const logLevel = ['debug', 'log', 'warn', 'error']
const logLevelHas = (level) => {
  return logLevel.indexOf(level) >= 0
}

class Logger {
  constructor({ level = process.env.PROD ? 'error' : 'debug', prefix }) {
    this.level = level
    this.prefix = prefix || level
    this.prefix = `[${this.prefix}]`
    this.methodToColorMap = {
      debug: '#7f8c8d', // Gray
      log: '#2ecc71', // Green
      warn: '#f39c12', // Yellow
      error: '#c0392b', // Red
      groupCollapsed: '#3498db', // Blue
      groupEnd: null // No colored prefix on groupEnd
    }
    for (const method of Object.keys(this.methodToColorMap)) {
      this[method] = (...args) => {
        this._print(method, args)
      }
    }
  }

  _print(method, args) {
    const styles = [
      `color: ${this.methodToColorMap[method]}`,
      'font-weight: bold'
    ]
    const logPrefix = ['%c' + this.prefix, styles.join(';')]
    if (this._shouldDo(method)) {
      if (method === 'debug') console.log(...logPrefix, ...args)
      else console[method](...logPrefix, ...args)
    }
  }

  setLogLevel(level) {
    if (!logLevelHas(level)) return false
    else {
      this.level = level
    }
  }

  _shouldDo(method) {
    if (logLevelHas(method)) {
      return logLevel.indexOf(method) >= logLevel.indexOf(this.level)
    } else {
      return true
    }
  }
}

export { Logger }
