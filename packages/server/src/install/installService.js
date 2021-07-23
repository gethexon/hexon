import "./config.js";
import { IAuthService } from "../auth/authService.js";
import { IConfigService } from "../base/configService.js";
import { ILogService } from "../base/logService.js";
import { IHexo } from "../hexo/core/hexo.js";
import DI from "../util/di.js";
import { InstallConfig } from "./config.js";
class InstallService {
    constructor() {
        this._configService = DI.inject(IConfigService);
        this._hexo = DI.inject(IHexo);
        this._authService = DI.inject(IAuthService);
        this._logger = DI.inject(ILogService).get('installer');
    }
    async install(options) {
        const { secret, expire, refresh, username, password } = options;
        this._authService.setSecurity({ secret, expire, refresh, username, password });
        this._configService.set(InstallConfig.INSTALLED, true);
        this._hexo.init();
        this._logger.info('installed');
    }
    checkInstalled() {
        return this._configService.get(InstallConfig.INSTALLED);
    }
}
const IInstallService = 'IInstallService';
DI.provide(IInstallService, InstallService);
export { IInstallService };
