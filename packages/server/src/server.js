#!/usr/bin/env node

require('./init')
require('./base')

// #region  dependences
const app = require('./app')
const http = require('http')
const DI = require('./util/di')
const { IHexo } = require('./hexo/core/hexo')
const { IConfigService } = require('./base/configService')
const { InstallConfig } = require('./install/config')
const { ILogService } = require('./base/logService')
// #endregion

// #endregion setup logger
const logService = DI.inject(ILogService)
const logger = logService.get('server')
logger.info('Starting server')
// #endregion

const configService = DI.inject(IConfigService)

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback())

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(configService.get(InstallConfig.PORT) || '3000')
// app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
if (configService.get(InstallConfig.INSTALLED)) {
  const hexo = DI.inject(IHexo)
  hexo.init().catch((err) => {
    logger.error(err)
    process.exit(1)
  })
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  logger.info('Server running on ' + bind)
  logger.info('Try visiting http://localhost:' + addr.port + ' through your browser')
}
