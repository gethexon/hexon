
require('./config')
const { IAuthService } = require('../auth/authService')
const { IConfigService } = require('../base/configService')
const { ILogService } = require('../base/logService')
const { IHexo } = require('../hexo/core/hexo')
const DI = require('../util/di')
const { InstallConfig } = require('./config')

class InstallService {
  constructor () {
    this._configService = DI.inject(IConfigService)
    this._hexo = DI.inject(IHexo)
    this._authService = DI.inject(IAuthService)
    this._logger = DI.inject(ILogService).get('installer')
  }

  async install (options) {
    const { secret, expire, refresh, username, password } = options
    this._authService.setSecurity({ secret, expire, refresh, username, password })
    this._configService.set(InstallConfig.INSTALLED, true)
    this._hexo.init()
    this._logger.info('installed')
  }

  checkInstalled () {
    return this._configService.get(InstallConfig.INSTALLED)
  }
}
const IInstallService = 'IInstallService'
DI.provide(IInstallService, InstallService)
exports.IInstallService = IInstallService
