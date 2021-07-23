'use strict';

var log4js = require('log4js');
var path = require('path');
var fs = require('fs');
var lodash = require('lodash');
var JSONdb = require('simple-json-db');
var Koa = require('koa');
var json = require('koa-json');
var onerror = require('koa-onerror');
var bodyparser = require('koa-bodyparser');
var koaLogger = require('koa-logger');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');
var cryptoJs = require('crypto-js');
var fs$1 = require('hexo-fs');
var chalk = require('chalk');
var Hexo$1 = require('hexo');
var hfm = require('hexo-front-matter');
var LTT = require('list-to-tree');
var hexoUtil = require('hexo-util');
var expandHomeDir = require('expand-home-dir');
var koaStatic = require('koa-static');
var Router = require('koa-router');
var Joi = require('joi');
var auth = require('basic-auth');
var compose = require('koa-compose');
var http = require('http');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var log4js__default = /*#__PURE__*/_interopDefaultLegacy(log4js);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var lodash__default = /*#__PURE__*/_interopDefaultLegacy(lodash);
var JSONdb__default = /*#__PURE__*/_interopDefaultLegacy(JSONdb);
var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var json__default = /*#__PURE__*/_interopDefaultLegacy(json);
var onerror__default = /*#__PURE__*/_interopDefaultLegacy(onerror);
var bodyparser__default = /*#__PURE__*/_interopDefaultLegacy(bodyparser);
var koaLogger__default = /*#__PURE__*/_interopDefaultLegacy(koaLogger);
var jwt__default = /*#__PURE__*/_interopDefaultLegacy(jwt);
var cryptoJs__default = /*#__PURE__*/_interopDefaultLegacy(cryptoJs);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs$1);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var Hexo__default = /*#__PURE__*/_interopDefaultLegacy(Hexo$1);
var hfm__default = /*#__PURE__*/_interopDefaultLegacy(hfm);
var LTT__default = /*#__PURE__*/_interopDefaultLegacy(LTT);
var expandHomeDir__default = /*#__PURE__*/_interopDefaultLegacy(expandHomeDir);
var koaStatic__default = /*#__PURE__*/_interopDefaultLegacy(koaStatic);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var Joi__default = /*#__PURE__*/_interopDefaultLegacy(Joi);
var auth__default = /*#__PURE__*/_interopDefaultLegacy(auth);
var compose__default = /*#__PURE__*/_interopDefaultLegacy(compose);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);

const isDev = process.env.NODE_ENV === 'development';

/**
 * 日志目录
 */
const LOG_FOLDER = path__default['default'].resolve(process.cwd(), 'log');
const getLogfilePath = filename => {
    return path__default['default'].resolve(LOG_FOLDER, filename);
};
if (!fs__default['default'].existsSync(LOG_FOLDER)) {
    fs__default['default'].mkdirSync(LOG_FOLDER);
}
function error$2(message) {
    const err = new Error(message);
    err.name = 'LogService';
    throw err;
}
class LogDescriptor {
    constructor(key, seprate = true, file = true, console = true) {
        if (!key || typeof key !== 'string')
            error$2('key must be not null string');
        this.key = key;
        this.console = console;
        this.file = file;
        this.seprate = seprate;
    }
}
class LogService {
    constructor() {
        this._descriptors = new Map();
        this._loggers = new Map();
        // #region register loggers
        this.register(new LogDescriptor('http'));
        this.register(new LogDescriptor('di'));
        this.register(new LogDescriptor('server'));
        this.register(new LogDescriptor('auth'));
        this.register(new LogDescriptor('hexo'));
        this.register(new LogDescriptor('installer', false));
        // #endregion
        // #region update log4js configuration
        const appenders = { ...LogService.baseAppenders };
        const categories = { ...LogService.baseCategories };
        this._descriptors.forEach(descriptor => {
            if (descriptor.file) {
                appenders[descriptor.key] = {
                    type: 'file',
                    filename: getLogfilePath(descriptor.key + '.log'),
                    removeColor: true
                };
            }
            const appender = [];
            if (descriptor.console)
                appender.push('console');
            appender.push('all');
            if (descriptor.file) {
                if (descriptor.seprate)
                    appender.push(descriptor.key);
                else
                    appender.push('default');
            }
            categories[descriptor.key] = {
                appenders: appender,
                level: isDev ? 'debug' : 'info'
            };
        });
        log4js__default['default'].configure({ appenders, categories });
        // #endregion
        this._descriptors.forEach(descriptor => {
            this._loggers.set(descriptor.key, log4js__default['default'].getLogger(descriptor.key));
        });
    }
    register(descriptor) {
        if (this._descriptors.has(descriptor.key))
            error$2(`logger ${descriptor.key} in use`);
        if (['defulat', 'all', 'logservice'].includes(descriptor.key)) {
            error$2('restricted key: ' + descriptor.key);
        }
        this._descriptors.set(descriptor.key, descriptor);
    }
    get(key) {
        if (!key)
            error$2('key is required');
        if (!this._descriptors.has(key))
            error$2(`logger ${key} not found`);
        return this._loggers.get(key);
    }
}
LogService.baseAppenders = {
    default: {
        type: 'file',
        filename: getLogfilePath('default.log'),
        removeColor: true
    },
    all: {
        type: 'file',
        filename: getLogfilePath('all.log'),
        removeColor: true
    },
    console: {
        type: 'console',
        layout: {
            type: 'pattern',
            pattern: '%[[%d{hh:mm:ss.SSS}][%c][%p]%] %m'
        }
    }
};
LogService.baseCategories = {
    default: {
        appenders: ['console', 'all', 'default'],
        level: isDev ? 'debug' : 'info'
    }
};
const ILogService = 'ILogService';

function error$1(message) {
    const err = new Error(message);
    err.name = 'DI';
    throw err;
}
const stack = [];
class DI {
    static provide(descriptor, ctor) {
        if (DI.ctors.has(descriptor))
            error$1(`descriptor ${descriptor} in use`);
        DI.ctors.set(descriptor, ctor);
        DI.logger.debug('provide', descriptor);
    }
    static inject(descriptor) {
        if (!descriptor)
            error$1('descriptor is required');
        if (!DI.ctors.has(descriptor))
            error$1(`descriptor ${descriptor} not found`);
        if (stack.includes(descriptor)) {
            error$1('circular dependences: ' + stack.concat(descriptor).join(' > '));
        }
        DI.logger.debug('inject', descriptor);
        stack.push(descriptor);
        let service;
        service = DI.services.get(descriptor);
        if (!service) {
            DI.logger.debug('instantiate', descriptor);
            service = new (DI.ctors.get(descriptor))();
            DI.services.set(descriptor, service);
        }
        stack.pop(descriptor);
        return service;
    }
    static from(ctors, services) {
        if (!ctors || !services)
            error$1('invalid init options');
        DI.ctors = ctors;
        DI.services = services;
    }
    static setLogger(logger) {
        DI.logger = logger;
    }
}
DI.ctors = new Map();
DI.services = new Map();

const logService$2 = new LogService();
DI.setLogger(logService$2.get('di'));
const ctors = new Map();
ctors.set(ILogService, LogService);
const services = new Map();
services.set(ILogService, logService$2);
DI.from(ctors, services);

const { throttle: throttle$1 } = lodash__default['default'];
class StorageService {
    constructor() {
        const root = path__default['default'].resolve(process.cwd(), './data');
        const name = 'sjson.db';
        if (!fs.existsSync(root))
            fs.mkdirSync(root);
        this.db = new JSONdb__default['default'](path__default['default'].resolve(root, name));
        this.sync = throttle$1(this.sync, 500);
    }
    get(key) {
        this.sync();
        const r = this.db.get(key);
        return r;
    }
    set(key, value) {
        const r = this.db.set(key, value);
        this.sync();
        return r;
    }
    sync() {
        this.db.sync();
    }
}
const IStorageService = 'IStorageService';
DI.provide(IStorageService, StorageService);

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
const genDescriptor = (defaultValue, type, required = false) => {
    return { defaultValue, type, required };
};

const AuthConfig = {
    AUTH_SECRET: 'auth.secret',
    AUTH_EXPIRE: 'auth.expire',
    AUTH_REFRESH: 'auth.refresh',
    AUTH_USERNAME: 'auth.username',
    AUTH_PASSWORD: 'auth.password'
};

const configService$3 = DI.inject(IConfigService);
// defalut username is admin
configService$3.register(
  AuthConfig.AUTH_USERNAME,
  genDescriptor("admin", "string")
);
// default password is admin SHA1(SHA1('admin').toString()).toString()
configService$3.register(
  AuthConfig.AUTH_PASSWORD,
  genDescriptor("7b2e9f54cdff413fcde01f330af6896c3cd7e6cd", "string")
);
configService$3.register(
  AuthConfig.AUTH_SECRET,
  genDescriptor("secret", "string")
);
configService$3.register(AuthConfig.AUTH_EXPIRE, genDescriptor("1h", "string"));
configService$3.register(AuthConfig.AUTH_REFRESH, genDescriptor("7d", "string"));
const { SHA1 } = cryptoJs__default['default'];
class AuthService {
  constructor() {
    this._configService = DI.inject(IConfigService);
    this._storageService = DI.inject(IStorageService);
    this._logger = DI.inject(ILogService).get("auth");
  }
  basicAuth(username, password) {
    if (username !== this._configService.get(AuthConfig.AUTH_USERNAME))
      return false;
    else if (
      SHA1(password).toString() !==
      this._configService.get(AuthConfig.AUTH_PASSWORD)
    )
      return false;
    this._logger.info("basic auth pass");
    return true;
  }
  getToken() {
    const uuid$1 = uuid.v4();
    const secret = this._configService.get(AuthConfig.AUTH_SECRET);
    const expire = this._configService.get(AuthConfig.AUTH_EXPIRE);
    const refresh = this._configService.get(AuthConfig.AUTH_REFRESH);
    const accessToken = jwt__default['default'].sign({ type: "access", uuid: uuid$1 }, secret, {
      expiresIn: expire,
    });
    const refreshToken = jwt__default['default'].sign({ type: "refresh", uuid: uuid$1 }, secret, {
      expiresIn: refresh,
    });
    const refreshTokens = this._storageService.get("refresh") || {};
    refreshTokens[uuid$1] = refreshToken;
    this._storageService.set("refresh", refreshTokens);
    return { accessToken, refreshToken };
  }
  verifyToken(token) {
    const res = jwt__default['default'].verify(
      token,
      this._configService.get(AuthConfig.AUTH_SECRET)
    );
    this._logger.debug("jwt auth pass");
    return res;
  }
  getUserInfo() {
    return {
      name: this._configService.get(AuthConfig.AUTH_USERNAME),
    };
  }
  setSecurity({ secret, expire, refresh, username, password } = {}) {
    secret && this._configService.set(AuthConfig.AUTH_SECRET, secret);
    expire && this._configService.set(AuthConfig.AUTH_EXPIRE, expire);
    refresh && this._configService.set(AuthConfig.AUTH_REFRESH, refresh);
    username && this._configService.set(AuthConfig.AUTH_USERNAME, username);
    password &&
      this._configService.set(
        AuthConfig.AUTH_PASSWORD,
        SHA1(password).toString()
      );
  }
}
const IAuthService = "IAuthService";
DI.provide(IAuthService, AuthService);

const InstallConfig = {
    INSTALLED: 'install.installed',
    PORT: 'install.port'
};
const configService$2 = DI.inject(IConfigService);
configService$2.register(InstallConfig.INSTALLED, genDescriptor(false, 'boolean'));
configService$2.register(InstallConfig.PORT, genDescriptor(5777, 'number', true));

const HexoConfig = {
    HEXO_ROOT: 'hexo.root'
};
const configService$1 = DI.inject(IConfigService);
configService$1.register(HexoConfig.HEXO_ROOT, genDescriptor('', 'string', true));

const restrictedKeys = [
    '_content',
    'tags',
    'category',
    'categories',
    'title',
    'date',
    'updated',
    'layout'
];
const checkIsBlog = cwd => {
    let file;
    try {
        // 检查是否有对应文件
        file = fs__default['default'].readFileSync(path__default['default'].join(cwd, 'package.json'));
        fs__default['default'].readFileSync(path__default['default'].join(cwd, '_config.yml'));
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }
        throw err;
    }
    // 检查是否有hexo依赖
    const packageJSON = JSON.parse(file);
    if (!packageJSON.dependencies.hexo)
        return false;
    return true;
};

const { throttle } = lodash__default['default'];
/**
   * Transform categories to string[][]
   * @param {string | string[] | string[][]} categories
   * @returns {string[][]}
   */
function postCategoriesRaw2Array2d(categories) {
    if (!categories)
        return [[]];
    if (!Array.isArray(categories))
        return [[categories]];
    else {
        if (!categories.filter((cat) => Array.isArray(cat)).length) {
            return [categories];
        }
        return categories.map((cat) => {
            return Array.isArray(cat) ? cat : [cat];
        });
    }
}
function postDocument2Object(doc) {
    if (doc.next)
        doc.next = doc.next._id;
    if (doc.prev)
        doc.prev = doc.prev._id;
    if (doc.date)
        doc.date = doc.date.valueOf();
    if (doc.updated)
        doc.updated = doc.updated.valueOf();
    const obj = doc.toObject();
    obj.tags = obj.tags.data.map(t => t._id);
    obj.categories = obj.categories.data.map(t => {
        return {
            _id: t._id,
            parent: t.parent
        };
    });
    function expand(category) {
        if (!category._child)
            return [category];
        return [category].concat(expand(category._child[0]));
    }
    const list = Object.keys(obj.categories).map(key => obj.categories[key]).map(obj => {
        if (obj.parent === undefined)
            obj.parent = 0;
        return obj;
    });
    const ltt = new LTT__default['default'](list, {
        key_id: '_id',
        key_parent: 'parent',
        key_child: '_child'
    });
    const tree = ltt.GetTree();
    obj.categories = (tree ? tree.map(expand) : [[]]).map(ca => ca.map(c => c._id));
    obj.fm = {};
    obj.fm.fm = hfm__default['default'].parse(obj.raw);
    restrictedKeys.map(key => {
        if (obj.fm.fm[key] !== undefined) {
            obj.fm[key] = obj.fm.fm[key];
            delete obj.fm.fm[key];
        }
    });
    if (obj.fm.categories)
        obj.fm.categories = postCategoriesRaw2Array2d(obj.fm.categories);
    return obj;
}
function pageDocument2Object(doc) {
    if (doc.date)
        doc.date = doc.date.valueOf();
    if (doc.updated)
        doc.updated = doc.updated.valueOf();
    const obj = doc.toObject();
    obj.fm = hfm__default['default'].parse(obj.raw);
    return obj;
}
function tagDocument2Object(doc) {
    const obj = doc.toObject();
    obj.posts = obj.posts.map(p => p._id);
    return obj;
}
function categoryDocument2Object(doc) {
    const obj = doc.toObject();
    obj.posts = obj.posts.map(p => p._id);
    return obj;
}
class HexoAPI {
    /**
     * 有关hexo的api操作封装
     */
    constructor() {
        this._configService = DI.inject(IConfigService);
        this.HEXO_ROOT = this._configService.get(HexoConfig.HEXO_ROOT);
        this._logger = DI.inject(ILogService).get('hexo');
        this.hexo = new Hexo__default['default'](this.HEXO_ROOT, {
            debug: false,
            draft: true,
            silent: process.env.NODE_ENV !== 'development'
        });
        /**
         * 每五秒执行一次，执行后五秒内触发不再执行
         */
        this.reload = throttle(this.reload, 5000, { trailing: false });
    }
    async freload() {
        await this.hexo.locals.invalidate();
        await this.hexo.load();
        this._logger.info('Force reload');
    }
    async reload() {
        await this.hexo.locals.invalidate();
        await this.hexo.load();
        this._logger.info('Reload');
    }
    async init() {
        await this.hexo.init();
    }
    async listPost() {
        await this.reload();
        const res = await this.hexo.locals.get('posts').toArray().map(postDocument2Object);
        this._logger.info('List posts', res.length);
        return res;
    }
    async listPage() {
        await this.reload();
        const res = await this.hexo.locals.get('pages').toArray().map(pageDocument2Object);
        this._logger.info('List pages', res.length);
        return res;
    }
    async listTag() {
        await this.reload();
        const res = await this.hexo.locals.get('tags').toArray().map(tagDocument2Object);
        this._logger.info('List tags', res.length);
        return res;
    }
    async listCategory() {
        await this.reload();
        const res = await this.hexo.locals.get('categories').toArray().map(categoryDocument2Object);
        this._logger.info('List categories', res.length);
        return res;
    }
    async stringify(raw, obj) {
        let str = '';
        str += hfm__default['default'].split(raw).separator;
        str += '\n';
        str += hfm__default['default'].stringify(obj);
        return str;
    }
}
const IHexoAPI = 'IHexoAPI';
DI.provide(IHexoAPI, HexoAPI);

class HexoCLI {
    /**
     * 有关hexo的cli操作封装
     * @param {String} HEXO_ROOT hexo路径
     */
    constructor() {
        this._configService = DI.inject(IConfigService);
        this.HEXO_ROOT = this._configService.get(HexoConfig.HEXO_ROOT);
        this._logger = DI.inject(ILogService).get('hexo');
    }
    /**
     *运行hexo命令
    * @param {String} cwd 路径
    * @param {String} command hexo命令
    * @param {Object} opt 命令选项
    */
    async run(cwd, command, opt = {}) {
        const args = Object.keys(opt).filter(key => opt[key]).map(key => '--' + key);
        await this.runcli(cwd, 'hexo', [command].concat(args));
    }
    /**
     * 运行cli命令
     * @param {String} cwd 路径
     * @param {String} command 命令
     * @param {String[]} args 参数
     */
    async runcli(cwd, command, args = []) {
        const string = [command].concat(args).map(key => {
            if (key.toString().includes(' '))
                return '"' + key + '"';
            else
                return key;
        }).join(' ');
        this._logger.info('Run ' + chalk__default['default'].blue('`' + string + '`') + ' ' + chalk__default['default'].gray(cwd));
        try {
            const res = await hexoUtil.spawn(command, args, { cwd });
            this._logger.info(res);
            this._logger.info('Finished');
            return res;
        }
        catch (err) {
            this._logger.error('Fail to run `' + string + '`');
            // this.logger.error(err)
            throw err;
        }
    }
    /**
     * hexo generate
     * https://hexo.io/zh-cn/docs/commands.html#generate
     */
    async generate(opt = { deploy: false, watch: false, bail: false, force: false, concurrency: false }) {
        await this.run(this.HEXO_ROOT, 'generate', opt);
    }
    /**
     * hexo deploy
     * https://hexo.io/zh-cn/docs/commands.html#deploy
     */
    async deploy(opt = { generate: false }) {
        await this.run(this.HEXO_ROOT, 'deploy', opt);
    }
    /**
     * hexo clean
     * https://hexo.io/zh-cn/docs/commands.html#clean
     */
    async clean() {
        await this.run(this.HEXO_ROOT, 'clean');
    }
    /**
     * hexo new
     * https://hexo.io/zh-cn/docs/commands.html#new
     * @param {String} title 文章名
     * @param {Object} opt 选项
     * @param {String} opt.layout 布局
     * @param {String} opt.path 路径
     * @param {String} opt.slug
     * @param {Boolean} opt.replace 是否替换已存在文件
     */
    async new(title, opt = { layout: undefined, path: undefined, slug: undefined, replace: false }) {
        const args = ['new'];
        if (opt.layout)
            args.push(opt.layout);
        if (opt.path) {
            args.push('--path');
            args.push(opt.path);
        }
        if (opt.replace)
            args.push('--replace');
        if (opt.slug) {
            args.push('--slug');
            args.push(opt.slug);
        }
        if (title)
            args.push(title);
        const info = await this.runcli(this.HEXO_ROOT, 'hexo', args);
        return expandHomeDir__default['default'](info.split('Created: ')[1].trim());
    }
    /**
     * hexo publish
     * https://hexo.io/zh-cn/docs/commands.html#publish
     * @param {String} filename 文件名
     * @param {String} layout 布局
     */
    async publish(filename, layout) {
        const args = ['publish'];
        if (layout)
            args.push(layout);
        args.push(filename);
        const info = await this.runcli(this.HEXO_ROOT, 'hexo', args);
        return expandHomeDir__default['default'](info.split('Published: ')[1].trim());
    }
    async server() {
        throw new Error('Not Implemented');
    }
    async render() {
        throw new Error('Not Implemented');
    }
    async migrate() {
        throw new Error('Not Implemented');
    }
    async list() {
        throw new Error('Not Implemented');
    }
    async init() {
        throw new Error('Not Implemented');
    }
    /**
     * https://hexo.io/zh-cn/docs/commands.html#version
    */
    async version() {
        this.runcli(this.HEXO_ROOT, 'hexo', ['version']);
    }
    async gitSync() {
        await this.runcli(this.HEXO_ROOT, 'git', ['reset', '--hard']);
        try {
            await this.runcli(this.HEXO_ROOT, 'git', ['pull']);
        }
        catch (e) {
            if (e.message.indexOf('no tracking information' > 0)) {
                this._logger.info('Local git reset');
            }
            else
                throw e;
        }
    }
    async gitSave() {
        await this.runcli(this.HEXO_ROOT, 'git', ['add', '.', '--all']);
        try {
            await this.runcli(this.HEXO_ROOT, 'git', ['commit', '-m', `server update ${new Date().toString()}`]);
        }
        catch (e) {
            if (e.code !== 1) {
                throw e;
            }
        }
        try {
            await this.runcli(this.HEXO_ROOT, 'git', ['push']);
        }
        catch (e) {
            if (e.message.indexOf('No configured push destination' > 0)) {
                this._logger.info('Local git commit');
            }
            else
                throw e;
        }
    }
}
const IHexoCLI = 'IHexoCLI';
DI.provide(IHexoCLI, HexoCLI);

class Hexo {
    constructor() {
        this._configService = DI.inject(IConfigService);
    }
    _checkReady() {
        if (!this.ready)
            throw new Error('Hexo initiating');
    }
    /**
     * 检测是否是hexo博客目录
     * 如果没有依赖hexo或者没有`_config.yml`则视为不是博客目录
     * 可能的错误：HexoError.NOT_BLOG_ROOT | other
     * @private
     */
    checkIsBlog(cwd) {
        if (!checkIsBlog(cwd))
            throw new Error('Not blog');
    }
    async init() {
        // TOD： 验证是不是hexo目录
        this.cwd = this._configService.get(HexoConfig.HEXO_ROOT);
        this.checkIsBlog(this.cwd);
        this.hapi = DI.inject(IHexoAPI);
        await this.hapi.init();
        this.hcli = DI.inject(IHexoCLI);
        this._logger = DI.inject(ILogService).get('hexo');
        this.ready = true;
    }
    async listPost() {
        this._checkReady();
        return this.hapi.listPost();
    }
    async listPage() {
        this._checkReady();
        return this.hapi.listPage();
    }
    async listTag() {
        this._checkReady();
        return this.hapi.listTag();
    }
    async listCategory() {
        this._checkReady();
        return this.hapi.listCategory();
    }
    /**
     * hexo new
     * https://hexo.io/zh-cn/docs/commands.html#new
     * @param {String} title 文章名
     * @param {Object} opt 选项
     * @param {String} opt.layout 布局
     * @param {String} opt.path 路径
     * @param {String} opt.slug
     * @param {Boolean} opt.replace 是否替换已存在文件
     */
    async new(title, opt = { layout: undefined, path: undefined, slug: undefined, replace: false }) {
        this._checkReady();
        const source = await this.hcli.new(...arguments);
        return this._getBySource(source);
    }
    async _getBySource(source) {
        await this.hapi.freload();
        const post = (await this.listPost()).concat(await this.listPage()).filter(p => p.full_source === source);
        if (post.length < 1) {
            this._logger.log('new id not found');
            throw new Error('Not found');
        }
        if (post.length > 1)
            throw new Error('Duplicate fail found, retry later');
        return post[0];
    }
    /**
     * 从id获取文件路径
     * @param {String} id 文章id
     * @param {Boolean} page 是否是页面
     */
    async _getSource(id, page = false) {
        const res = (page ? (await this.hapi.listPage()) : (await this.hapi.listPost())).filter(r => r._id === id);
        if (res.length < 1) {
            throw new Error('Not found');
        }
        return res[0].full_source;
    }
    /**
     * 从id获取原数据
     * @param {String} id 文章id
     * @param {Boolean} page 是否是页面
     */
    async _getRaw(id, page = false) {
        const res = (page ? (await this.hapi.listPage()) : (await this.hapi.listPost())).filter(r => r._id === id);
        if (res.length < 1) {
            throw new Error('Not found');
        }
        return res[0].raw;
    }
    async write(id, obj, page = false) {
        this._checkReady();
        const article = JSON.parse(JSON.stringify(obj));
        if (article.fm && typeof article.fm === 'object') {
            Object.keys(article.fm).forEach(key => {
                if (key !== 'fm' && !restrictedKeys.includes(key))
                    article[key] = article.fm[key];
            });
            if (article.fm.fm !== undefined)
                article.fm = article.fm.fm;
            else
                delete article.fm;
        }
        Object.keys(article).forEach(key => { if (article[key] === undefined || article[key] === '')
            delete article[key]; });
        const string = await this.hapi.stringify(await this._getRaw(id, page), article);
        const source = await this._getSource(id, page);
        fs__namespace.writeFileSync(source, string);
        this._logger.info('Write file', chalk__default['default'].magenta(source));
        await this.hapi.freload();
        return (page ? (await this.listPage()) : (await this.listPost())).filter(p => p._id === id)[0];
    }
    /**
     * 根据id删除文章
     * @param {String} id 需要删除的文章id
     * @param {Boolean} page 是否是页面
     */
    async delete(id, page = false) {
        this._checkReady();
        const source = await this._getSource(id, page);
        fs__namespace.unlinkSync(source);
        await this.hapi.freload();
        this._logger.info('Delete file', chalk__default['default'].magenta(source));
    }
    /**
     * hexo generate
     * https://hexo.io/zh-cn/docs/commands.html#generate
     */
    async generate(opt = { deploy: false, watch: false, bail: false, force: false, concurrency: false }) {
        this._checkReady();
        return this.hcli.generate(...arguments);
    }
    /**
     * hexo deploy
     * https://hexo.io/zh-cn/docs/commands.html#deploy
     */
    async deploy(opt = { generate: false }) {
        this._checkReady();
        return this.hcli.deploy(...arguments);
    }
    /**
     * hexo clean
     * https://hexo.io/zh-cn/docs/commands.html#clean
     */
    async clean() {
        this._checkReady();
        return this.hcli.clean(...arguments);
    }
    /**
     * hexo publish
     * https://hexo.io/zh-cn/docs/commands.html#publish
     * @param {String} filename 文件名
     * @param {String} layout 布局
     */
    async publish(id, layout = 'post') {
        this._checkReady();
        const posts = (await this.listPost()).filter(p => p._id === id);
        if (posts.length < 1) {
            this._logger.log('publish id not found');
            throw new Error('Not found');
        }
        const post = posts[0];
        if (post.published)
            throw new Error('Already published');
        const filename = path__default['default'].basename(post.source, path__default['default'].extname(post.source));
        const source = await this.hcli.publish(filename, layout);
        return this._getBySource(source);
    }
    async gitSync() {
        return this.hcli.gitSync();
    }
    async gitSave() {
        return this.hcli.gitSave();
    }
}
const IHexo = 'IHexo';
DI.provide(IHexo, Hexo);

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

const validateRequestBody = v => {
    return async (ctx, next) => {
        try {
            await v.validateAsync(ctx.request.body);
        }
        catch (err) {
            console.log(err);
            ctx.status = 400;
            ctx.body = {
                message: 'Validation failed',
                details: err.details.map(d => d.message)
            };
            return;
        }
        await next();
    };
};
const validateRequestQuery = v => {
    return async (ctx, next) => {
        try {
            await v.validateAsync(ctx.request.query);
        }
        catch (err) {
            ctx.status = 400;
            ctx.body = {
                message: 'Validation failed',
                details: err.details.map(d => d.message)
            };
            return;
        }
        await next();
    };
};

const v$2 = {
    install: Joi__default['default'].object({
        secret: Joi__default['default'].string().required(),
        expire: Joi__default['default'].string().required(),
        refresh: Joi__default['default'].string().required(),
        username: Joi__default['default'].string().required(),
        password: Joi__default['default'].string().required()
    })
};
const checkInstalled = async (ctx, next) => {
    const installService = DI.inject(IInstallService);
    const installed = installService.checkInstalled();
    if (installed) {
        ctx.status = 404;
    }
    else
        await next();
};
const notInstalled = async (ctx, next) => {
    ctx.status = 200;
};
const install = async (ctx, next) => {
    const installService = DI.inject(IInstallService);
    const { secret, expire, refresh, username, password } = ctx.request.body;
    await installService.install({ secret, expire, refresh, username, password });
    ctx.status = 200;
};

const router$2 = new Router__default['default']();
router$2.prefix('/install');
router$2.use(checkInstalled);
router$2.get('/', notInstalled);
router$2.post('/', validateRequestBody(v$2.install), install);

const logger$1 = DI.inject(ILogService).get('auth');
function extractToken(ctx) {
    return ctx.header.authorization.split(' ')[1];
}
function resolveAuthorizationHeader(ctx) {
    if (!ctx.header || !ctx.header.authorization) {
        return;
    }
    const parts = ctx.header.authorization.split(' ');
    if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
            return credentials;
        }
    }
    throw new Error('Authtication Error');
}
const v$1 = {
    password: Joi__default['default'].object({ password: Joi__default['default'].string().required() })
};
const basicAuth = async function (ctx, next) {
    const authService = DI.inject(IAuthService);
    // get name and pass from reqest header
    const user = auth__default['default'](ctx.request);
    if (!user) {
        // if not a valide basic auth header
        const err = new Error();
        err.status = 401;
        err.message = 'basic authentication required';
        throw err;
    }
    else {
        // find if user exist in database
        const valid = authService.basicAuth(user.name, user.pass);
        // let query = await User.find(user)
        if (valid) {
            await next();
        }
        else {
            const err = new Error();
            err.status = 401;
            err.message = 'wrong username or password';
            throw err;
        }
    }
};
const getToken = async function (ctx, next) {
    const authService = DI.inject(IAuthService);
    ctx.body = authService.getToken();
};
const jwtAuth = compose__default['default']([async (ctx, next) => {
        try {
            await next();
        }
        catch (err) {
            if (err.message === 'Authtication Error') {
                ctx.status = 401;
                ctx.body = {
                    message: 'Authtication Error'
                };
            }
        }
    }, async function (ctx, next) {
        const authService = DI.inject(IAuthService);
        // 为了动态读取secret
        const token = resolveAuthorizationHeader(ctx);
        if (!token) {
            throw new Error('Authtication Error');
        }
        else {
            try {
                const decoded = authService.verifyToken(token);
                ctx.state.user = decoded;
            }
            catch (err) {
                throw new Error('Authtication Error');
            }
            await next();
        }
    }]);
const blacklist = async (ctx, next) => {
    const storage = DI.inject(IStorageService);
    const token = extractToken(ctx);
    if ((storage.get('blacklist') || []).map(o => o.token).includes(token)) {
        logger$1.info('block invalid refresh token');
        const err = new Error();
        err.status = 401;
        err.message = 'Authentication Error';
        throw err;
    }
    await next();
};
const requestAccessToken = async function (ctx, next) {
    if (ctx.state.user.type !== 'access') {
        const err = new Error();
        err.status = 403;
        err.message = 'Require Access Token';
        throw err;
    }
    await next();
};
const requestRefreshToken = async function (ctx, next) {
    if (ctx.state.user.type !== 'refresh') {
        const err = new Error();
        err.status = 403;
        err.message = 'Require Refresh Token';
        throw err;
    }
    logger$1.info('refresh token used');
    await next();
};
const logout = async (ctx, next) => {
    const storage = DI.inject(IStorageService);
    const token = extractToken(ctx);
    let blacklist = (storage.get('blacklist') || []);
    const refreshTokens = (storage.get('refresh') || {});
    const refreshToken = refreshTokens[ctx.state.user.uuid];
    if (refreshToken) {
        blacklist.push({ token, exp: ctx.state.user.exp });
        blacklist = blacklist.filter(o => o.exp > parseInt((new Date()).valueOf() / 1000, 10));
        logger$1.info('block token');
        storage.set('blacklist', blacklist);
        delete refreshTokens[ctx.state.user.uuid];
        storage.set('refresh', refreshTokens);
    }
    ctx.status = 200;
};
const info = async (ctx, next) => {
    const authService = DI.inject(IAuthService);
    ctx.body = authService.getUserInfo();
};
const password = async (ctx, next) => {
    const { password } = ctx.request.body;
    const authService = DI.inject(IAuthService);
    ctx.body = authService.setSecurity({ password });
};

const router$1 = new Router__default['default']();
router$1.post('/login', basicAuth, getToken);
router$1.post('/refresh', jwtAuth, blacklist, requestRefreshToken, getToken);
router$1.get('/info', jwtAuth, requestAccessToken, info);
router$1.post('/logout', jwtAuth, requestAccessToken, logout);
router$1.post('/password', basicAuth, validateRequestBody(v$1.password), password);

/**
 * 使用正则的简单搜索
 * @param {RegExp} query 搜索正则
 * @param {Object[]} data 数据数组
 * @param {string} key id_key
 * @param {string} content content_key
 * @returns 结果 id 数组
 */
const simpleSearch = (query, data, key, content) => {
    return data
        .filter(record => query.test(record[content]))
        .map(record => record[key]);
};
const search = async (query, mode = '') => {
    if (!query)
        return [];
    const hexo = DI.inject(IHexo);
    const regexp = new RegExp(query, mode);
    const posts = await hexo.listPost();
    const pages = await hexo.listPage();
    const articles = posts.concat(pages);
    const results = simpleSearch(regexp, articles, '_id', 'raw');
    return results;
};

const v = {
    generate: Joi__default['default'].object({
        deploy: Joi__default['default'].boolean(),
        watch: Joi__default['default'].boolean(),
        bail: Joi__default['default'].boolean(),
        force: Joi__default['default'].boolean(),
        concurrency: Joi__default['default'].boolean()
    }),
    deploy: Joi__default['default'].object({
        generate: Joi__default['default'].boolean()
    }),
    new: Joi__default['default'].object({
        title: Joi__default['default'].string().required(),
        layout: Joi__default['default'].string(),
        path: Joi__default['default'].string(),
        slug: Joi__default['default'].string(),
        replace: Joi__default['default'].boolean()
    }),
    update: Joi__default['default'].object({
        id: Joi__default['default'].string().required(),
        page: Joi__default['default'].boolean(),
        obj: Joi__default['default'].object().required()
    }),
    delete: Joi__default['default'].object({
        id: Joi__default['default'].string().required(),
        page: Joi__default['default'].boolean()
    }),
    publish: Joi__default['default'].object({
        id: Joi__default['default'].string().required()
    })
};
const qv = {
    search: Joi__default['default'].object({
        query: Joi__default['default'].string(),
        mode: Joi__default['default'].string()
    })
};
const generate = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    await hexo.generate(ctx.request.body);
    ctx.status = 200;
};
const deploy = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    await hexo.deploy(ctx.request.body);
    ctx.status = 200;
};
const clean = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    await hexo.clean();
    ctx.status = 200;
};
const listPost = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    ctx.body = await hexo.listPost();
};
const listPage = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    ctx.body = await hexo.listPage();
};
const listTag = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    ctx.body = await hexo.listTag();
};
const listCategory = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    ctx.body = await hexo.listCategory();
};
const new$0 = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    const { title, layout, path, slug, replace } = ctx.request.body;
    const res = await hexo.new(title, { layout, path, slug, replace });
    ctx.status = 200;
    ctx.body = res;
};
const update = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    const { id, page, obj } = ctx.request.body;
    const res = await hexo.write(id, obj, page);
    ctx.status = 200;
    ctx.body = res;
};
const delete$0 = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    const { id, page } = ctx.request.body;
    await hexo.delete(id, page);
    ctx.status = 200;
};
const publish = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    const { id } = ctx.request.body;
    const res = await hexo.publish(id);
    ctx.body = res;
    ctx.status = 200;
};
const gitSync = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    await hexo.gitSync();
    ctx.status = 200;
};
const gitSave = async (ctx, next) => {
    const hexo = DI.inject(IHexo);
    await hexo.gitSave();
    ctx.status = 200;
};
const notGitRepo = async (ctx, next) => {
    try {
        await next();
    }
    catch (e) {
        // TODO 其他平台和git版本如何检测
        if (e.message.indexOf('not a git repo') > -1) {
            ctx.status = 503;
            ctx.body = {
                message: 'not a git repo'
            };
        }
        else
            throw e;
    }
};
const search$0 = async (ctx, next) => {
    ctx.body = await search(decodeURIComponent(ctx.query.query), ctx.query.mode);
};

const notFound = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        if (err.message === 'Not found') {
            ctx.status = 404;
            ctx.body = { message: 'id not found' };
        }
        else
            throw err;
    }
};
const hexoInitiating = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        if (err.message === 'Hexo initiating') {
            ctx.status = 503;
            ctx.body = { message: 'Hexo initiating' };
        }
        else
            throw err;
    }
};

const router = new Router__default['default']();
router.use(hexoInitiating);
router.post('/generate', validateRequestBody(v.generate), generate);
router.post('/deploy', validateRequestBody(v.deploy), deploy);
router.post('/clean', clean);
router.get('/posts', listPost);
router.get('/pages', listPage);
router.get('/tags', listTag);
router.get('/categories', listCategory);
router.post('/new', validateRequestBody(v.new), notFound, new$0);
router.post('/update', validateRequestBody(v.update), notFound, update);
router.post('/delete', validateRequestBody(v.delete), notFound, delete$0);
router.post('/publish', validateRequestBody(v.publish), notFound, publish);
router.post('/git/sync', notGitRepo, gitSync);
router.post('/git/save', notGitRepo, gitSave);
router.get('/search', validateRequestQuery(qv.search), search$0);

const app = new Koa__default['default']();
const logService$1 = DI.inject(ILogService);
const serverLogger = logService$1.get('server');
const httpLogger = logService$1.get('http');
// error handler
onerror__default['default'](app);
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        ctx.status = err.status || 500;
        if (ctx.status === 500 && process.env.NODE_ENV !== 'development') {
            ctx.body.message = 'server internal error. Fix problem and try again later. This can be caused by unexpected input or server error.';
            serverLogger.error(500, err);
            return;
        }
        ctx.body = {
            message: err.message
        };
    }
});
// middlewares
app.use(bodyparser__default['default']({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json__default['default']());
app.use(koaLogger__default['default']((str, args) => {
    // redirect koa logger to other output pipe
    // default is process.stdout(by console.log function)
    httpLogger.info(str);
}));
app.use(koaStatic__default['default']({ resolve: path.resolve }.resolve(__dirname, '../../web/dist/pwa')));
app.use(router$2.routes(), router$2.allowedMethods());
app.use(router$1.routes(), router$1.allowedMethods());
app.use(jwtAuth);
app.use(requestAccessToken);
app.use(router.routes(), router.allowedMethods());

// #endregion
// #endregion setup logger
const logService = DI.inject(ILogService);
const logger = logService.get("server");
logger.info("Starting server");
// #endregion
const configService = DI.inject(IConfigService);
/**
 * Create HTTP server.
 */
const server = http__default['default'].createServer(app.callback());
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(configService.get(InstallConfig.PORT) || "3000");
// app.set('port', port);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
if (configService.get(InstallConfig.INSTALLED)) {
    const hexo = DI.inject(IHexo);
    hexo.init().catch((err) => {
        logger.error(err);
        process.exit(1);
    });
}
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated privileges");
            process.exit(1);
        case "EADDRINUSE":
            logger.error(bind + " is already in use");
            process.exit(1);
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    logger.info("Server running on " + bind);
    logger.info("Try visiting http://localhost:" + addr.port + " through your browser");
}
