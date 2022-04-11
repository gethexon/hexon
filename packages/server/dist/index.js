'use strict';

require('reflect-metadata');
var tsyringe = require('tsyringe');
var http = require('http');
var fs = require('fs');
var path = require('path');
var JSONdb = require('simple-json-db');
var HexoCore = require('hexo');
var chalk = require('chalk');
var dayjs = require('dayjs');
require('debug');
var cors = require('@koa/cors');
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var compress = require('koa-compress');
var logger = require('koa-logger');
var mount = require('koa-mount');
var compose = require('koa-compose');
var Router = require('@koa/router');
var CryptoJS = require('crypto-js');
var httpErrors = require('http-errors');
var typedef = require('@hexon/typedef');
var execa = require('execa');
var crypto = require('crypto');
var JSEncrypt = require('node-jsencrypt');
var serve = require('koa-static');
var koaAuthentication = require('@winwin/koa-authentication');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var JSONdb__default = /*#__PURE__*/_interopDefaultLegacy(JSONdb);
var HexoCore__default = /*#__PURE__*/_interopDefaultLegacy(HexoCore);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var bodyParser__default = /*#__PURE__*/_interopDefaultLegacy(bodyParser);
var compress__default = /*#__PURE__*/_interopDefaultLegacy(compress);
var logger__default = /*#__PURE__*/_interopDefaultLegacy(logger);
var mount__default = /*#__PURE__*/_interopDefaultLegacy(mount);
var compose__default = /*#__PURE__*/_interopDefaultLegacy(compose);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var CryptoJS__default = /*#__PURE__*/_interopDefaultLegacy(CryptoJS);
var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var JSEncrypt__default = /*#__PURE__*/_interopDefaultLegacy(JSEncrypt);
var serve__default = /*#__PURE__*/_interopDefaultLegacy(serve);

/**
 * @deprecated
 */
const HEXO_BASE_DIR_KEY$1 = "hexo-basedir";
const BRIEF_LENGTH = 500;
const HEXON_PORT_KEY = "@hexon/port";
const HEXON_DEFAULT_PORT = 5777;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const defaultRoot = path.resolve(process.cwd(), "data");
const defaultFilename = "common.db";
let StorageService = class StorageService {
    constructor() {
        this._root = defaultRoot;
        this._filename = defaultFilename;
        if (!fs.existsSync(this._root))
            fs.mkdirSync(this._root);
        this._db = new JSONdb__default["default"](path.resolve(this._root, this._filename));
    }
    get(key) {
        return this._db.get(key);
    }
    set(key, value) {
        this._db.set(key, value);
    }
    delete(key) {
        return this._db.delete(key);
    }
};
StorageService = __decorate([
    tsyringe.singleton(),
    __metadata("design:paramtypes", [])
], StorageService);

const DEFAULT_DATE_FORMAT = "YYYY-MM-DD hh:mm:ss.SSS";
class LogService {
    constructor() {
        this.scope = "";
        this.dateFormat = DEFAULT_DATE_FORMAT;
    }
    _prefix(type) {
        let prefix = "";
        this.scope && (prefix += chalk__default["default"][type].bold(`[${this.scope}]`));
        prefix += chalk__default["default"].blue(`[${dayjs__default["default"]().format(this.dateFormat)}]`);
        return prefix;
    }
    _log(...args) {
        console.log(...args);
    }
    _error(...args) {
        console.error(...args);
    }
    setScope(scope) {
        this.scope = scope;
    }
    log(...args) {
        this._log(this._prefix("green"), ...args);
    }
    error(...args) {
        this._error(this._prefix("red"), ...args);
    }
    logWithUser(user, ...args) {
        this._log(this._prefix("green") +
            chalk__default["default"].yellow.dim(`[${user.username}:${user.slug}]`), ...args);
    }
    static create(scope) {
        const instance = tsyringe.container.resolve(LogService);
        instance.setScope(scope);
        return instance;
    }
}

function isBlog(cwd) {
    var _a;
    let file;
    try {
        // 检查是否有对应文件
        file = fs__default["default"].readFileSync(path__default["default"].join(cwd, "package.json"), {
            encoding: "utf-8",
        });
        fs__default["default"].readFileSync(path__default["default"].join(cwd, "_config.yml"), { encoding: "utf-8" });
    }
    catch (err) {
        if (err.code === "ENOENT") {
            return false;
        }
        throw err;
    }
    // 检查是否有hexo依赖
    const packageJSON = JSON.parse(file);
    if (!((_a = packageJSON === null || packageJSON === void 0 ? void 0 : packageJSON.dependencies) === null || _a === void 0 ? void 0 : _a.hexo))
        return false;
    return true;
}
function toRealPath(value) {
    return path__default["default"].isAbsolute(value)
        ? value
        : path__default["default"].resolve(process.cwd(), "../..", value);
}

const DEV = process.env.NODE_ENV !== "production";
function expandHomeDir(fullpath) {
    const homedir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
    if (!fullpath)
        return fullpath;
    if (fullpath == "~")
        return homedir;
    if (fullpath.slice(0, 2) != "~/")
        return fullpath;
    return path__default["default"].join(homedir, fullpath.slice(2));
}

var HexoInstanceService_1;
class NotHexoBlogError extends Error {
    constructor() {
        super(...arguments);
        this.name = "NotHexoBlogError";
    }
}
class EmptyHexoBlogError extends Error {
    constructor() {
        super(...arguments);
        this.name = "EmptyHexoBlogError";
    }
}
class HexoCoreInitError extends Error {
    constructor() {
        super(...arguments);
        this.name = "HexoCoreInitError";
    }
}
class HexoCoreInitiatingError extends Error {
    constructor() {
        super(...arguments);
        this.name = "HexoCoreInitiatingError";
    }
}
const HEXO_BASE_DIR_KEY = "hexo-basedir";
const HEXO_OPTIONS_KEY = "hexo-options";
let HexoInstanceService = HexoInstanceService_1 = class HexoInstanceService {
    constructor(_logService, _storageService) {
        this._logService = _logService;
        this._storageService = _storageService;
        this._options = null;
        this._base = null;
        this._hexo = null;
        this._ready = false;
        this._logService.setScope("hexo-instance-service");
    }
    _withOptionsOverrides(options) {
        return Object.assign(Object.assign({}, options), { draft: true, drafts: true });
    }
    _setHexoBase() {
        const base = this._storageService.get(HEXO_BASE_DIR_KEY);
        const base_dir = path__default["default"].resolve(__dirname, toRealPath(base));
        if (!isBlog(base_dir))
            throw new NotHexoBlogError();
        this._base = base_dir;
    }
    _setOptions() {
        this._options =
            this._storageService.get(HEXO_OPTIONS_KEY) || {};
        this._options.silent = DEV ? false : this._options.silent;
    }
    _createHexoInstance() {
        if (!this._base)
            throw new EmptyHexoBlogError();
        this._hexo = new HexoCore__default["default"](this._base, this._withOptionsOverrides(this._options));
    }
    _init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._logService.log("real init start");
            this._ready = false;
            yield this._setHexoBase();
            yield this._setOptions();
            yield this._createHexoInstance();
            yield this._hexo.init();
            yield this._hexo.watch();
            this._ready = true;
            this._logService.log("real init finished");
        });
    }
    setOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this._storageService.set(HEXO_OPTIONS_KEY, options);
            this._logService.log("options set");
        });
    }
    init(retry = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!retry && HexoInstanceService_1.INITING) {
                throw new HexoCoreInitiatingError();
            }
            try {
                HexoInstanceService_1.CURRENT_RETRY++;
                HexoInstanceService_1.INITING = true;
                HexoInstanceService_1.INIT_ERROR = null;
                yield this._init();
                HexoInstanceService_1.CURRENT_RETRY = 0;
                HexoInstanceService_1.INITING = false;
            }
            catch (err) {
                this._logService.error(err);
                this._logService.error(`error when init hexo instance. `);
                this._logService.error(`retry in ${HexoInstanceService_1.RETRY_INTERVAL} ms.`, `${HexoInstanceService_1.CURRENT_RETRY}/${HexoInstanceService_1.MAX_RETRY}`);
                if (HexoInstanceService_1.CURRENT_RETRY >= HexoInstanceService_1.MAX_RETRY) {
                    HexoInstanceService_1.INIT_ERROR = new HexoCoreInitError(String(err));
                    HexoInstanceService_1.INITING = false;
                    HexoInstanceService_1.CURRENT_RETRY = 0;
                    throw HexoInstanceService_1.INIT_ERROR;
                }
                yield new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.init(true));
                    }, HexoInstanceService_1.RETRY_INTERVAL);
                });
            }
        });
    }
    getBaseDir() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._ready)
                yield this.init();
            return this._base;
        });
    }
    getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._ready)
                yield this.init();
            this._logService.log("instance required");
            return this._hexo;
        });
    }
    getInstanceWithOriginOptions(genOptions = (o) => o) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOptions = genOptions(this._options);
            const hexo = new HexoCore__default["default"](this._base, newOptions);
            yield hexo.init();
            yield hexo.watch();
            HexoInstanceService_1.TO_BE_CLEANED++;
            this._logService.log("instance with options required");
            this._logService.log(`${HexoInstanceService_1.TO_BE_CLEANED} extra instance to be cleaned`);
            const cleanup = () => __awaiter(this, void 0, void 0, function* () {
                yield hexo.unwatch();
                HexoInstanceService_1.TO_BE_CLEANED--;
                this._logService.log("instance with options cleaned");
                if (HexoInstanceService_1.TO_BE_CLEANED === 0) {
                    this._logService.log("all instances have been cleaned");
                }
                else {
                    this._logService.log(`${HexoInstanceService_1.TO_BE_CLEANED} extra instance to be cleaned`);
                }
            });
            return { hexo, cleanup };
        });
    }
    runBetweenReload(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            const unload = () => __awaiter(this, void 0, void 0, function* () {
                HexoInstanceService_1.INIT_ERROR = null;
                yield this._hexo.unwatch();
            });
            const load = () => __awaiter(this, void 0, void 0, function* () {
                yield this._hexo.watch();
                HexoInstanceService_1.INITING = false;
            });
            const markHexoInitError = (err) => {
                this._ready = false;
                HexoInstanceService_1.INIT_ERROR = new HexoCoreInitError(String(err));
                HexoInstanceService_1.INITING = false;
                throw HexoInstanceService_1.INIT_ERROR;
            };
            HexoInstanceService_1.INITING = true;
            yield unload().catch(markHexoInitError);
            const res = yield Promise.resolve(fn());
            yield load().catch(markHexoInitError);
            return res;
        });
    }
};
HexoInstanceService.INITING = false;
HexoInstanceService.RETRY_INTERVAL = 1000;
HexoInstanceService.MAX_RETRY = 2;
HexoInstanceService.CURRENT_RETRY = 0;
HexoInstanceService.TO_BE_CLEANED = 0;
HexoInstanceService = HexoInstanceService_1 = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(LogService)),
    __param(1, tsyringe.inject(StorageService)),
    __metadata("design:paramtypes", [LogService, Object])
], HexoInstanceService);

var AccountService_1;
let AccountService = AccountService_1 = class AccountService {
    constructor(_storage) {
        this._storage = _storage;
    }
    _encrypt(raw) {
        return CryptoJS.SHA1(raw).toString();
    }
    _toStorage(info) {
        this._storage.set(AccountService_1.KEY, info);
    }
    _fromStorage() {
        const { username = "", password = "" } = this._storage.get(AccountService_1.KEY) || {};
        return { username, password };
    }
    setUserInfo(username, password) {
        this._storage.set(AccountService_1.KEY, {
            username,
            password: this._encrypt(password),
        });
    }
    getUsername() {
        return this._fromStorage().username;
    }
    setUsername(username) {
        const info = this._fromStorage();
        info.username = username;
        this._toStorage(info);
    }
    setPassword(password) {
        const info = this._fromStorage();
        info.password = this._encrypt(password);
        this._toStorage(info);
    }
    setEncrptedPassword(password) {
        const info = this._fromStorage();
        info.password = password;
        this._toStorage(info);
    }
    verify(username, password) {
        const info = this._fromStorage();
        if (username !== info.username) {
            throw new httpErrors.Unauthorized();
        }
        if (this._encrypt(password) !== info.password) {
            throw new httpErrors.Unauthorized();
        }
    }
};
AccountService.KEY = "userinfo";
AccountService = AccountService_1 = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageService)),
    __metadata("design:paramtypes", [StorageService])
], AccountService);

var AuthStorageService_1;
let AuthStorageService = AuthStorageService_1 = class AuthStorageService {
    constructor(_storage, _logService) {
        this._storage = _storage;
        this._logService = _logService;
        this._logService.setScope("auth-storage-service");
    }
    _toStorage(info) {
        this._storage.set(AuthStorageService_1.KEY, info);
    }
    _fromStorage() {
        const { secret = "secret", expiresIn = "1h", refreshableIn = "7d", } = this._storage.get(AuthStorageService_1.KEY) || {};
        return { secret, expiresIn, refreshableIn };
    }
    setAuthInfo(info) {
        this._toStorage(info);
        this._logService.log(`set auth info`);
    }
    getSecret() {
        const s = this._fromStorage().secret;
        this._logService.log(`get secret`);
        return s;
    }
    getAuthInfo() {
        const s = this._fromStorage();
        this._logService.log(`get auth info`);
        return s;
    }
};
AuthStorageService.KEY = "authinfo";
AuthStorageService = AuthStorageService_1 = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageService)),
    __param(1, tsyringe.inject(LogService)),
    __metadata("design:paramtypes", [StorageService,
        LogService])
], AuthStorageService);

var InstallService_1;
let InstallService = InstallService_1 = class InstallService {
    constructor(_storage, _account, _auth, _logService) {
        this._storage = _storage;
        this._account = _account;
        this._auth = _auth;
        this._logService = _logService;
        if (!this._storage.get(InstallService_1.KEY))
            this._storage.set(InstallService_1.KEY, false);
        this._logService.setScope("install-service");
    }
    isInstalled() {
        const res = this._storage.get(InstallService_1.KEY);
        this._logService.log("query installed", res);
        return res;
    }
    install(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = options, auth = __rest(options, ["username", "password"]);
            this._account.setUserInfo(username, password);
            this._auth.setAuthInfo(auth);
            this._storage.set(InstallService_1.KEY, true);
            this._logService.log("installed");
        });
    }
};
InstallService.KEY = "@hexon/installed";
InstallService = InstallService_1 = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageService)),
    __param(1, tsyringe.inject(AccountService)),
    __param(2, tsyringe.inject(AuthStorageService)),
    __param(3, tsyringe.inject(LogService)),
    __metadata("design:paramtypes", [Object, AccountService,
        AuthStorageService,
        LogService])
], InstallService);

const router$5 = new Router__default["default"]();
router$5.get("/", (ctx) => {
    const service = tsyringe.container.resolve(InstallService);
    if (service.isInstalled()) {
        ctx.status = 404;
    }
    else {
        ctx.status = 200;
        ctx.body = "Waiting For Install";
    }
});
router$5.post("/", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const service = tsyringe.container.resolve(InstallService);
    if (service.isInstalled()) {
        ctx.status = 404;
        return;
    }
    const { username, password, secret, expiresIn, refreshableIn } = ctx.request.body;
    if ([username, password, secret, expiresIn, refreshableIn].some((value) => !value))
        ctx.status = 400;
    else {
        yield service.install({
            username,
            password,
            secret,
            expiresIn,
            refreshableIn,
        });
        ctx.status = 200;
    }
}));

const checkInstall = () => (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const service = tsyringe.container.resolve(InstallService);
    if (!service.isInstalled()) {
        ctx.status = 404;
        ctx.body = "Install required";
    }
    else
        yield next();
});

const app$4 = new Koa__default["default"]();
app$4.use(router$5.routes());
app$4.use(router$5.allowedMethods());

const router$4 = new Router__default["default"]();
router$4.get("/", (ctx) => {
    ctx.status = 200;
});
const app$3 = new Koa__default["default"]();
app$3.use(router$4.routes());
app$3.use(router$4.allowedMethods());

const toPost = (post) => post;
const toPage = (post) => post;
const toCategory = (post) => post;
const toTag = (post) => post;
const execLogService = tsyringe.container.resolve(LogService);
execLogService.setScope("exec-service");
function run(command, args, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        execLogService.log(`run ${command} ${args.join(" ")}`);
        return (yield execa__default["default"](command, args, Object.assign(Object.assign({}, opt), { stdio: "pipe" }))).stdout;
    });
}

class InvalidPathOptionError extends Error {
    constructor() {
        super(...arguments);
        this.name = "InvalidPathOptionError";
    }
}
function transformPost(doc) {
    var _a, _b;
    return Object.assign(Object.assign({}, doc), { slug: doc.slug, date: doc === null || doc === void 0 ? void 0 : doc.date.toString(), updated: doc === null || doc === void 0 ? void 0 : doc.updated.toString(), prev: (_a = doc === null || doc === void 0 ? void 0 : doc.prev) === null || _a === void 0 ? void 0 : _a.source, next: (_b = doc === null || doc === void 0 ? void 0 : doc.next) === null || _b === void 0 ? void 0 : _b.source, tags: doc.tags.data.map((t) => t.slug), categories: doc === null || doc === void 0 ? void 0 : doc.categories.data.map((c) => c.slug), brief: doc._content.slice(0, BRIEF_LENGTH) });
}
function transformPostToBrief(doc) {
    const res = Object.assign(Object.assign({}, doc), { brief: doc._content.slice(0, BRIEF_LENGTH) });
    delete res._content;
    delete doc.content;
    delete doc.raw;
    return res;
}
function transformPage(doc) {
    var _a, _b;
    return Object.assign(Object.assign({}, doc), { slug: doc.slug, date: doc === null || doc === void 0 ? void 0 : doc.date.toString(), updated: doc === null || doc === void 0 ? void 0 : doc.updated.toString(), prev: (_a = doc === null || doc === void 0 ? void 0 : doc.prev) === null || _a === void 0 ? void 0 : _a.source, next: (_b = doc === null || doc === void 0 ? void 0 : doc.next) === null || _b === void 0 ? void 0 : _b.source, brief: doc._content.slice(0, BRIEF_LENGTH) });
}
function transformPageToBrief(doc) {
    const res = Object.assign(Object.assign({}, doc), { brief: doc._content.slice(0, BRIEF_LENGTH) });
    delete res._content;
    delete res.content;
    delete res.raw;
    return res;
}
let HexoService = class HexoService {
    constructor(_logService, _hexoInstanceService) {
        this._logService = _logService;
        this._hexoInstanceService = _hexoInstanceService;
        this._logService.setScope("hexo-service");
    }
    //#region helpers
    runWithoutModifiedOption(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hexo, cleanup } = yield this._hexoInstanceService.getInstanceWithOriginOptions();
            yield fn(hexo);
            yield cleanup();
        });
    }
    getPostByFullSource(fullSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const hexo = yield this._hexoInstanceService.getInstance();
            const post = hexo.locals
                .get("posts")
                .toArray()
                .find((item) => item.full_source === fullSource);
            return this.getPostBySource(post.source);
        });
    }
    getPostOrPageByFullSource(fullSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const hexo = yield this._hexoInstanceService.getInstance();
            const post = hexo.locals
                .get("posts")
                .toArray()
                .find((item) => item.full_source === fullSource);
            if (post)
                return this.getPostBySource(post.source);
            const page = hexo.locals
                .get("pages")
                .toArray()
                .find((item) => item.full_source === fullSource);
            return this.getPageBySource(page.source);
        });
    }
    writeFile(fullPath, content) {
        try {
            fs__default["default"].writeFileSync(fullPath, content);
        }
        catch (e) {
            this._logService.error("fail to write file");
            this._logService.error(e);
            throw new Error("fail to write file");
        }
    }
    deleteFile(fullPath) {
        try {
            fs__default["default"].rmSync(fullPath);
        }
        catch (e) {
            this._logService.error("fail to delete file");
            this._logService.error(e);
            throw new Error("fail to delete file");
        }
    }
    getFullPathBySource(source, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const hexo = yield this._hexoInstanceService.getInstance();
            if (type === "post")
                return hexo.locals
                    .get("posts")
                    .toArray()
                    .find((item) => item.source === source).full_source;
            else
                return hexo.locals
                    .get("pages")
                    .toArray()
                    .find((item) => item.source === source).full_source;
        });
    }
    WithCategoriesTagsBriefArticleList(article) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.listCategory();
            const tags = yield this.listTag();
            const pages = yield this.listPage();
            const posts = yield this.listPost();
            return { article, categories, tags, pages, posts };
        });
    }
    //#endregion
    //#region IHexoAPI
    listPost() {
        return __awaiter(this, void 0, void 0, function* () {
            const hexo = yield this._hexoInstanceService.getInstance();
            const docs = hexo.locals.get("posts").toArray().map(toPost);
            const res = docs.map((postDoc) => {
                const post = transformPostToBrief(transformPost(postDoc));
                delete post.content;
                delete post._content;
                delete post.raw;
                delete post.more;
                return post;
            });
            this._logService.log("list post", res.length);
            return res;
        });
    }
    getPostBySource(source) {
        return __awaiter(this, void 0, void 0, function* () {
            const hexo = yield this._hexoInstanceService.getInstance();
            const docs = hexo.locals.get("posts").toArray().map(toPost);
            const doc = docs.find((item) => item.source === source);
            if (!doc)
                throw new Error("not found");
            const res = transformPost(doc);
            this._logService.log("get post by source", source);
            return res;
        });
    }
    listPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const hexo = yield this._hexoInstanceService.getInstance();
            const docs = hexo.locals.get("pages").toArray().map(toPage);
            const res = docs.map((pageDoc) => {
                const page = transformPageToBrief(transformPage(pageDoc));
                delete page.content;
                delete page._content;
                delete page.raw;
                delete page.more;
                return page;
            });
            this._logService.log("list page", res.length);
            return res;
        });
    }
    getPageBySource(source) {
        return __awaiter(this, void 0, void 0, function* () {
            const hexo = yield this._hexoInstanceService.getInstance();
            const docs = hexo.locals.get("pages").toArray().map(toPage);
            const doc = docs.find((item) => item.source === source);
            if (!doc)
                throw new Error("not found");
            const res = transformPage(doc);
            this._logService.log("get page by source", source);
            return res;
        });
    }
    listCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const hexo = yield this._hexoInstanceService.getInstance();
            const docs = hexo.locals.get("categories").toArray().map(toCategory);
            const res = docs.map((categoryDoc) => (Object.assign(Object.assign({}, categoryDoc), { posts: categoryDoc.posts.map((p) => p.slug) })));
            this._logService.log("list category", res.length);
            return res;
        });
    }
    listTag() {
        return __awaiter(this, void 0, void 0, function* () {
            const hexo = yield this._hexoInstanceService.getInstance();
            const docs = hexo.locals.get("tags").toArray().map(toTag);
            const res = docs.map((tagDoc) => (Object.assign(Object.assign({}, tagDoc), { posts: tagDoc.posts.map((p) => p.slug) })));
            this._logService.log("list tag", res.length);
            return res;
        });
    }
    //#endregion
    //#region IHexoCommand
    deploy(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { generate = false } = options;
            const args = [];
            if (generate)
                args.push("--generate");
            this.runWithoutModifiedOption((hexo) => __awaiter(this, void 0, void 0, function* () {
                yield hexo.call("deploy", { _: args });
                yield hexo.exit();
            }));
            this._logService.log(`run hexo deploy with args:`, args.join(" "));
        });
    }
    generate(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deploy = false, watch = false, bail = false, force = false, concurrency = false, } = options;
            const args = [];
            if (deploy)
                args.push("--deploy");
            if (watch)
                args.push("--watch");
            if (bail)
                args.push("--bail");
            if (force)
                args.push("--force");
            this.runWithoutModifiedOption((hexo) => __awaiter(this, void 0, void 0, function* () {
                if (concurrency)
                    args.push("--concurrency");
                yield hexo.call("generate", { _: args });
                yield hexo.exit();
            }));
            this._logService.log(`run hexo generate with args:`, args.join(" "));
        });
    }
    clean() {
        return __awaiter(this, void 0, void 0, function* () {
            this.runWithoutModifiedOption((hexo) => __awaiter(this, void 0, void 0, function* () {
                yield hexo.call("clean");
                yield hexo.exit();
            }));
            this._logService.log("run hexo clean");
        });
    }
    //#endregion
    //#region IHexoCli
    publish(filename, layout) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = ["publish"];
            if (layout)
                args.push(layout);
            args.push(filename);
            const info = yield run("hexo", args, {
                cwd: yield this._hexoInstanceService.getBaseDir(),
            });
            const fullSource = expandHomeDir(info.split("Published: ")[1].trim());
            const article = yield this.getPostByFullSource(fullSource);
            const res = this.WithCategoriesTagsBriefArticleList(article);
            this._logService.log(`publish ${filename} with layout: ${layout}`);
            return res;
        });
    }
    create(title, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = ["new"];
            if (options.layout)
                args.push(options.layout);
            if (options.path) {
                try {
                    const base = yield this._hexoInstanceService.getBaseDir();
                    const fullPath = path__default["default"].resolve(base, options.path);
                    const relative = path__default["default"].relative(fullPath, base);
                    if (!relative.startsWith("..")) {
                        this._logService.error(`${fullPath} is not valid`);
                        throw new Error();
                    }
                }
                catch (err) {
                    throw new InvalidPathOptionError(err.message);
                }
                args.push("--path");
                args.push(options.path);
            }
            if (options.replace)
                args.push("--replace");
            if (options.slug) {
                args.push("--slug");
                args.push(options.slug);
            }
            if (title)
                args.push(title);
            const info = yield this._hexoInstanceService.runBetweenReload(() => __awaiter(this, void 0, void 0, function* () {
                return yield run("hexo", args, {
                    cwd: yield this._hexoInstanceService.getBaseDir(),
                });
            }));
            const fullSource = expandHomeDir(info.split("Created: ")[1].trim());
            const article = yield this.getPostOrPageByFullSource(fullSource);
            const res = this.WithCategoriesTagsBriefArticleList(article);
            this._logService.log("create succeed", fullSource);
            return res;
        });
    }
    update(source, raw, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = yield this.getFullPathBySource(source, type);
            if (!fullPath)
                throw new Error("not found");
            this._hexoInstanceService.runBetweenReload(() => {
                this.writeFile(fullPath, raw);
            });
            const article = yield this.getPostBySource(source);
            return this.WithCategoriesTagsBriefArticleList(article);
        });
    }
    delete(source, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = yield this.getFullPathBySource(source, type);
            if (!fullPath)
                throw new Error("not found");
            yield this._hexoInstanceService.runBetweenReload(() => __awaiter(this, void 0, void 0, function* () {
                yield this.deleteFile(fullPath);
            }));
            return this.WithCategoriesTagsBriefArticleList(null);
        });
    }
};
HexoService = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(LogService)),
    __param(1, tsyringe.inject(HexoInstanceService)),
    __metadata("design:paramtypes", [LogService,
        HexoInstanceService])
], HexoService);

const router$3 = new Router__default["default"]();
router$3.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (err) {
        if (err instanceof HexoCoreInitError) {
            ctx.status = 500;
            ctx.body = {
                code: typedef.ERROR_CODE.E_INIT,
                message: err.message,
            };
        }
        else if (err instanceof HexoCoreInitiatingError) {
            ctx.status = 503;
            ctx.body = {
                code: typedef.ERROR_CODE.E_INITIATING,
                message: "hexo core initiating please wait for a second",
            };
        }
        else if (err instanceof InvalidPathOptionError) {
            ctx.status = 400;
            ctx.body = {
                code: typedef.ERROR_CODE.E_INVALID_CREATE_OPTION_PATH,
                message: "hexo core initiating please wait for a second",
            };
        }
        else if (err instanceof Error && err.message === "not found") {
            ctx.status = 404;
            ctx.body = {
                code: typedef.ERROR_CODE.E_NOT_FOUND,
                message: "not found",
            };
        }
        else
            throw err;
    }
}));
router$3.get("/posts", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    ctx.body = yield hexo.listPost();
}));
router$3.get("/post/:source", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    const { source } = ctx.params;
    if (!source) {
        ctx.status = 400;
        ctx.body = "need `source`";
    }
    ctx.body = yield hexo.getPostBySource(decodeURIComponent(source));
}));
router$3.get("/pages", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    ctx.body = yield hexo.listPage();
}));
router$3.get("/page/:source", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    const { source } = ctx.params;
    if (!source) {
        ctx.status = 400;
        ctx.body = "need `source`";
    }
    ctx.body = yield hexo.getPageBySource(decodeURIComponent(source));
}));
router$3.get("/tags", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    ctx.body = yield hexo.listTag();
}));
router$3.get("/categories", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    ctx.body = yield hexo.listCategory();
}));
router$3.post("/deploy", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    yield hexo.deploy(ctx.request.body);
    ctx.status = 200;
}));
router$3.post("/generate", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    yield hexo.generate(ctx.request.body);
    ctx.status = 200;
}));
router$3.post("/clean", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    yield hexo.clean();
    ctx.status = 200;
}));
router$3.post("/publish", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    const { filename, layout } = ctx.request.body;
    if (!filename) {
        ctx.status = 400;
        ctx.body = "need `filename`";
        return;
    }
    ctx.body = yield hexo.publish(filename, layout);
}));
router$3.post("/create", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    const { title, layout, path, slug, replace } = ctx.request.body;
    if (!title) {
        ctx.status = 400;
        ctx.body = "need `title`";
        return;
    }
    ctx.body = yield hexo.create(title, { layout, path, slug, replace });
}));
router$3.put("/post/:source", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    const { source } = ctx.params;
    const { raw } = ctx.request.body;
    if (!source || !raw) {
        ctx.status = 400;
        ctx.body = "need `source` and `raw`";
        return;
    }
    ctx.body = yield hexo.update(source, raw, "post");
}));
router$3.put("/page/:source", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    const { source } = ctx.params;
    const { raw } = ctx.request.body;
    if (!source || !raw) {
        ctx.status = 400;
        ctx.body = "need `source` and `raw`";
        return;
    }
    ctx.body = yield hexo.update(source, raw, "page");
}));
router$3.delete("/post/:source", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    const { source } = ctx.params;
    if (!source) {
        ctx.status = 400;
        ctx.body = "need `source` ";
        return;
    }
    ctx.body = yield hexo.delete(source, "post");
}));
router$3.delete("/page/:source", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const hexo = tsyringe.container.resolve(HexoService);
    const { source } = ctx.params;
    if (!source) {
        ctx.status = 400;
        ctx.body = "need `source` ";
        return;
    }
    ctx.body = yield hexo.delete(source, "page");
}));

const app$2 = new Koa__default["default"]();
app$2.use(router$3.routes());
app$2.use(router$3.allowedMethods());

class ResetHardError extends Error {
    constructor() {
        super(...arguments);
        this.name = "ResetHardError";
    }
}
class PullError extends Error {
    constructor() {
        super(...arguments);
        this.name = "PullError";
    }
}
class AddAllError extends Error {
    constructor() {
        super(...arguments);
        this.name = "AddAllError";
    }
}
class CreateCommitError extends Error {
    constructor() {
        super(...arguments);
        this.name = "CreateCommitError";
    }
}
class PushError extends Error {
    constructor() {
        super(...arguments);
        this.name = "PushError";
    }
}

function isClean(repoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return !(yield run("git", ["status", "-s"], { cwd: repoPath }));
    });
}
function hasRepo(repoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return run("git", ["rev-parse", "--is-inside-work-tree"], {
            cwd: repoPath,
        }).then(() => true, () => false);
    });
}
function hasRemtoe(repoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return !!(yield run("git", ["remote", "-v"], { cwd: repoPath }));
    });
}
let GitService = class GitService {
    constructor(storage, _logService) {
        this.storage = storage;
        this._logService = _logService;
        this._logService.setScope("git-service");
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            const base = this.storage.get(HEXO_BASE_DIR_KEY$1);
            const cwd = toRealPath(base);
            if (!(yield hasRepo(cwd))) {
                this._logService.log("not git repo, skipped");
                return;
            }
            yield run("git", ["reset", "--hard"], { cwd }).catch((err) => {
                this._logService.error(err);
                this._logService.error("git reset hard error");
                throw new ResetHardError();
            });
            this._logService.log("git reset succeed");
            if (yield hasRemtoe(cwd)) {
                yield run("git", ["pull"], { cwd }).catch((err) => {
                    console.error(err);
                    throw new PullError();
                });
            }
            else {
                this._logService.log("no remote detected, skip pull");
            }
            this._logService.log("sync succeed");
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const base = this.storage.get(HEXO_BASE_DIR_KEY$1);
            const cwd = toRealPath(base);
            if (!(yield hasRepo(cwd))) {
                this._logService.log("not git repo, skipped");
                return;
            }
            if (yield isClean(cwd)) {
                this._logService.log("work space clean no need to save");
                return;
            }
            yield run("git", ["add", ".", "--all"], { cwd }).catch((err) => {
                this._logService.error(err);
                this._logService.error("git add all error");
                throw new AddAllError();
            });
            this._logService.log("git add succeed");
            yield run("git", ["commit", "-m", `server update ${new Date().toString()}`], { cwd }).catch((err) => {
                this._logService.error(err);
                this._logService.error("git commit error");
                throw new CreateCommitError();
            });
            this._logService.log("git commit succeed");
            if (yield hasRemtoe(cwd)) {
                yield run("git", ["push"], { cwd }).catch((err) => {
                    this._logService.error(err);
                    this._logService.error("git push error");
                    throw new PushError();
                });
            }
            else {
                this._logService.log("no remote detected, skip push");
            }
            this._logService.log("save succeed");
        });
    }
};
GitService = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageService)),
    __param(1, tsyringe.inject(LogService)),
    __metadata("design:paramtypes", [StorageService,
        LogService])
], GitService);

const router$2 = new Router__default["default"]();
router$2.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (err) {
        if ([
            "RepoOpenError",
            "ResetHardError",
            "PullError",
            "AddAllError",
            "CreateCommitError",
            "PushError",
        ].includes(err)) {
            ctx.status = 500;
            ctx.body = err.name;
            return;
        }
        throw err;
    }
}));
router$2.post("/sync", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const git = tsyringe.container.resolve(GitService);
    yield git.sync();
    ctx.status = 200;
}));
router$2.post("/save", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const git = tsyringe.container.resolve(GitService);
    yield git.save();
    ctx.status = 200;
}));

const app$1 = new Koa__default["default"]();
app$1.use(router$2.routes());
app$1.use(router$2.allowedMethods());

var SettingsService_1;
let SettingsService = SettingsService_1 = class SettingsService {
    constructor(_storageService) {
        this._storageService = _storageService;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return (this._storageService.get(SettingsService_1.KEY) || {});
        });
    }
    set(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            this._storageService.set(SettingsService_1.KEY, settings);
        });
    }
};
SettingsService.KEY = "settings";
SettingsService = SettingsService_1 = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageService)),
    __metadata("design:paramtypes", [StorageService])
], SettingsService);

const router$1 = new Router__default["default"]();
router$1.get("/settings", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const settingsService = tsyringe.container.resolve(SettingsService);
    ctx.body = yield settingsService.get();
}));
router$1.post("/settings", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const settingsService = tsyringe.container.resolve(SettingsService);
    const settings = (_a = ctx.request.body) !== null && _a !== void 0 ? _a : {};
    yield settingsService.set(settings);
    ctx.status = 200;
}));

var ERROR_CODE;
(function (ERROR_CODE) {
    ERROR_CODE[ERROR_CODE["E_INIT"] = 0] = "E_INIT";
    ERROR_CODE[ERROR_CODE["E_INITIATING"] = 1] = "E_INITIATING";
    ERROR_CODE[ERROR_CODE["E_UNKNOWN"] = 2] = "E_UNKNOWN";
    ERROR_CODE[ERROR_CODE["E_NOT_FOUND"] = 3] = "E_NOT_FOUND";
    ERROR_CODE[ERROR_CODE["E_INVALID_CREATE_OPTION_PATH"] = 4] = "E_INVALID_CREATE_OPTION_PATH";
    ERROR_CODE[ERROR_CODE["E_BAD_REQUEST"] = 5] = "E_BAD_REQUEST";
})(ERROR_CODE || (ERROR_CODE = {}));
function createErrorResponse(code, message) {
    return { code, message };
}

var FrontmatterTemplateService_1;
let FrontmatterTemplateService = FrontmatterTemplateService_1 = class FrontmatterTemplateService {
    constructor(_storageService) {
        this._storageService = _storageService;
    }
    _list() {
        return (this._storageService.get(FrontmatterTemplateService_1.KEY) || []);
    }
    _set(items) {
        this._storageService.set(FrontmatterTemplateService_1.KEY, items);
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._list();
        });
    }
    set(items) {
        return __awaiter(this, void 0, void 0, function* () {
            this._set(items);
        });
    }
};
FrontmatterTemplateService.KEY = "frontmatter-template";
FrontmatterTemplateService = FrontmatterTemplateService_1 = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageService)),
    __metadata("design:paramtypes", [StorageService])
], FrontmatterTemplateService);

const router = new Router__default["default"]();
router.prefix("/template");
router.get("/frontmatter", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const frontmatterTemplateService = tsyringe.container.resolve(FrontmatterTemplateService);
    const items = yield frontmatterTemplateService.list();
    ctx.body = { items };
}));
router.post("/frontmatter", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const items = (_a = ctx.request.body) === null || _a === void 0 ? void 0 : _a.items;
    if (!items) {
        ctx.status = 400;
        ctx.body = createErrorResponse(ERROR_CODE.E_BAD_REQUEST, "`raw` is required");
        return;
    }
    const frontmatterTemplateService = tsyringe.container.resolve(FrontmatterTemplateService);
    yield frontmatterTemplateService.set(items);
    ctx.status = 200;
    ctx.body = { message: "OK" };
}));

/**
 * config app entrance
 */
var apps = compose__default["default"]([
    mount__default["default"]("/install", app$4),
    checkInstall(),
    mount__default["default"]("/health", app$3),
    mount__default["default"]("/hexo", app$2),
    mount__default["default"]("/git", app$1),
    router$1.routes(),
    router.routes(),
]);

function secure(enable = () => true) {
    const { publicKey, privateKey } = crypto__default["default"].generateKeyPairSync("rsa", {
        // The standard secure default length for RSA keys is 2048 bits
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
    });
    function decryptRSA(data) {
        const o = new JSEncrypt__default["default"]();
        o.setPrivateKey(privateKey);
        const res = o.decrypt(data);
        return res;
    }
    function decryptAES(data, key) {
        return CryptoJS__default["default"].AES.decrypt(data, key).toString(CryptoJS__default["default"].enc.Utf8);
    }
    function encryptAES(data, key) {
        return CryptoJS__default["default"].AES.encrypt(data, key).toString();
    }
    CryptoJS__default["default"].AES.encrypt('"hi"', "123").toString();
    function isGetPublicKeyRoute(ctx) {
        return (ctx.request.path.startsWith("/publickey") && ctx.request.method === "GET");
    }
    function stringifyData(data) {
        return JSON.stringify(data);
    }
    function parseData(data) {
        const str = data;
        return JSON.parse(str);
    }
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        if (typeof enable === "function" ? !enable() : !enable) {
            yield next();
            return;
        }
        if (isGetPublicKeyRoute(ctx)) {
            console.log(chalk__default["default"].white("GET"), chalk__default["default"].white.dim("/publickey"));
            ctx.body = publicKey;
            return;
        }
        const prefix = "/secure/";
        const enced = decodeURIComponent(ctx.path.slice(prefix.length));
        const secured = ctx.path.startsWith(prefix);
        if (secured) {
            const res = decryptRSA(enced);
            if (!res) {
                ctx.status = 403;
                ctx.body = { code: "EHTTPSECURE" };
                return;
            }
            const decoded = JSON.parse(res);
            ctx.path = decoded.url;
            const key = decoded.key;
            ctx.originalUrl = "[secure]" + ctx.path;
            ctx.request.body =
                ctx.request.method !== "GET" &&
                    parseData(decryptAES(ctx.request.body.content, key)).data;
            yield next();
            const content = encryptAES(stringifyData({ data: ctx.body }), key);
            ctx.body = { content };
        }
        else {
            yield next();
            return;
        }
    });
}

const ROOT = path__default["default"].resolve(process.cwd(), "../web/dist");
const statics = serve__default["default"](ROOT, {
    setHeaders: (res, fullpath) => {
        const isHtml = path__default["default"].extname(fullpath).toLowerCase() === ".html";
        if (isHtml)
            res.setHeader("Cache-Control", "no-cache");
        else
            res.setHeader("Cache-Control", "max-age=31536000");
    },
});

const auth = koaAuthentication.createAuth({
    verify(username, password) {
        const account = tsyringe.container.resolve(AccountService);
        account.verify(username, password);
    },
    secret() {
        return tsyringe.container.resolve(AuthStorageService).getSecret();
    },
});
auth.router.post("/password", auth.auth, (ctx) => {
    const account = tsyringe.container.resolve(AccountService);
    const { oldPassword, password } = ctx.request.body;
    account.verify(ctx.state.user.username, oldPassword);
    account.setPassword(password);
    ctx.status = 200;
});
auth.router.post("/username", auth.auth, (ctx, next) => {
    const account = tsyringe.container.resolve(AccountService);
    const { username } = ctx.request.body;
    account.setUsername(username);
    ctx.state.user.username = username;
    return next();
}, auth.cookie, (ctx) => (ctx.status = 200));

const app = new Koa__default["default"]();
app.use(cors__default["default"]());
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (err) {
        ctx.status = err.status || 500;
        if (ctx.status === 500) {
            ctx.body = { message: DEV ? err : "server internal error" };
            console.error(err);
        }
        else
            ctx.body = { message: err.message };
    }
}));
app.use(bodyParser__default["default"]({
    enableTypes: ["json", "form", "text"],
}));
app.use(secure());
app.use(logger__default["default"]());
app.use(compress__default["default"]());
app.use(mount__default["default"]("/", statics));
app.use(auth.router.routes());
app.use(auth.auth);
app.use(apps);

const storage = tsyringe.container.resolve(StorageService);
const server = http__default["default"].createServer(app.callback());
server.on("listening", () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
    console.log("Server running on " + bind);
    const his = tsyringe.container.resolve(HexoInstanceService);
    his.init();
});
server.listen(storage.get(HEXON_PORT_KEY) || HEXON_DEFAULT_PORT);
