import DI from "../util/di.js";
import { IStorageService } from "./storageService.js";
function error(message) {
    const err = new Error(message);
    err.name = 'ConfigService';
    throw err;
}
class ConfigService {
    constructor() {
        this._storageService = DI.inject(IStorageService);
        this._map = new Map();
    }
    getConfigDefs() {
        return [...this._map.keys()].map(key => ({ ...this._map.get(key), key }));
    }
    getConfig() {
        return this._storageService.get('config') || {};
    }
    _setConfig(config) {
        this._storageService.set('config', config);
    }
    _hasKey(key) {
        if (!this._map.has(key)) {
            error('Unknown config key: ' + key);
        }
    }
    get(key) {
        this._hasKey(key);
        const config = this.getConfig();
        if (Object.prototype.hasOwnProperty.call(config, key))
            return config[key];
        else if (this._map.get(key).required)
            error(`config ${key} shoundn't be null`);
        else
            return this._map.get(key).defaultValue;
    }
    set(key, value) {
        this._hasKey(key);
        let config = this.getConfig();
        if (typeof value === 'undefined')
            delete config[key];
        else
            config = { ...config, [key]: value };
        this._setConfig(config);
    }
    register(key, descriptor = null) {
        if (this._map.has(key))
            return false;
        this._map.set(key, descriptor);
        return true;
    }
}
const IConfigService = 'IConfigService';
DI.provide(IConfigService, ConfigService);
export const genDescriptor = (defaultValue, type, required = false) => {
    return { defaultValue, type, required };
};
export { IConfigService };
