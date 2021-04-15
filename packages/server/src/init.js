// #region init logService
const { ILogService, LogService } = require('./base/logService')
const logService = new LogService()
// then logService is available
// #endregion

// #region init DI
const DI = require('./util/di')
DI.setLogger(logService.get('di'))
const ctors = new Map()
ctors.set(ILogService, LogService)
const services = new Map()
services.set(ILogService, logService)
DI.from(ctors, services)
// then DI is available
// #endregion
