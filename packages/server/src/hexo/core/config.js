const HexoConfig = {
  HEXO_ROOT: 'hexo.root'
}
const DI = require('../../util/di')
const { IConfigService, genDescriptor } = require('../../base/configService')
const configService = DI.inject(IConfigService)
configService.register(HexoConfig.HEXO_ROOT, genDescriptor('', 'string', true))
module.exports = HexoConfig
