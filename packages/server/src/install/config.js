const DI = require('../util/di')
const { IConfigService, genDescriptor } = require('../base/configService')
const InstallConfig = {
  INSTALLED: 'install.installed',
  PORT: 'install.port'
}
const configService = DI.inject(IConfigService)
configService.register(InstallConfig.INSTALLED, genDescriptor(false, 'boolean'))
configService.register(InstallConfig.PORT, genDescriptor(5777, 'number', true))
exports.InstallConfig = InstallConfig
