import DI from "../util/di.js";
import { IConfigService, genDescriptor } from "../base/configService.js";
const InstallConfig = {
    INSTALLED: 'install.installed',
    PORT: 'install.port'
};
const configService = DI.inject(IConfigService);
configService.register(InstallConfig.INSTALLED, genDescriptor(false, 'boolean'));
configService.register(InstallConfig.PORT, genDescriptor(5777, 'number', true));
export { InstallConfig };
