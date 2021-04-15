
require('./config')
const { SHA1 } = require('crypto-js')
const AuthConfig = require('../auth/config')
const { IConfigService } = require('../base/configService')
const { ILogService } = require('../base/logService')
const HexoConfig = require('../hexo/core/config')
const { IHexo } = require('../hexo/core/hexo')
const DI = require('../util/di')
const { InstallConfig } = require('./config')

class InstallService {
  constructor () {
    this._configService = DI.inject(IConfigService)
    this._hexo = DI.inject(IHexo)
    this._logger = DI.inject(ILogService).get('installer')
  }

  async install (options) {
    const { root, secret, expire, refresh, username, password } = options
    await this._hexo.checkIsBlog(root)
    this._configService.set(HexoConfig.HEXO_ROOT, root)
    this._configService.set(AuthConfig.AUTH_SECRET, secret)
    this._configService.set(AuthConfig.AUTH_EXPIRE, expire)
    this._configService.set(AuthConfig.AUTH_REFRESH, refresh)
    this._configService.set(AuthConfig.AUTH_USERNAME, username)
    this._configService.set(AuthConfig.AUTH_PASSWORD, SHA1(password).toString())
    this._configService.set(InstallConfig.INSTALLED, true)
    this._hexo.init()
    this._logger.info('installed')
  }

  checkIsBlog (root) {
    this._hexo.checkIsBlog(root)
    this._logger.info('checkIsBlog pass', root)
  }

  checkInstalled () {
    return this._configService.get(InstallConfig.INSTALLED)
  }
}
const IInstallService = 'IInstallService'
DI.provide(IInstallService, InstallService)
exports.IInstallService = IInstallService
