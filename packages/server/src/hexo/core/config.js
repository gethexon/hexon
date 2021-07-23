import DI from "../../util/di.js";
import { IConfigService, genDescriptor } from "../../base/configService.js";
const HexoConfig = {
    HEXO_ROOT: 'hexo.root'
};
const configService = DI.inject(IConfigService);
configService.register(HexoConfig.HEXO_ROOT, genDescriptor('', 'string', true));
export default HexoConfig;
