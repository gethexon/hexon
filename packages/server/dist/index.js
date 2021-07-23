'use strict';

require('reflect-metadata');
var tsyringe = require('tsyringe');
var fs = require('fs');
var path = require('path');
var JSONdb = require('simple-json-db');
var jwt = require('jsonwebtoken');
var Debug = require('debug');
var http = require('http');
var Koa = require('koa');
var logger = require('koa-logger');
var koaBody = require('koa-body');
var onerror = require('koa-onerror');
var cors = require('@koa/cors');
var compose = require('koa-compose');
var mount = require('koa-mount');
var Router = require('@koa/router');
var auth = require('basic-auth');
var cryptoJs = require('crypto-js');
var statics = require('winwin-statics');
var HexoCore = require('hexo');
var chalk = require('chalk');

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

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var JSONdb__default = /*#__PURE__*/_interopDefaultLegacy(JSONdb);
var jwt__namespace = /*#__PURE__*/_interopNamespace(jwt);
var Debug__default = /*#__PURE__*/_interopDefaultLegacy(Debug);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var logger__default = /*#__PURE__*/_interopDefaultLegacy(logger);
var koaBody__default = /*#__PURE__*/_interopDefaultLegacy(koaBody);
var onerror__default = /*#__PURE__*/_interopDefaultLegacy(onerror);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var compose__default = /*#__PURE__*/_interopDefaultLegacy(compose);
var mount__default = /*#__PURE__*/_interopDefaultLegacy(mount);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var auth__default = /*#__PURE__*/_interopDefaultLegacy(auth);
var statics__default = /*#__PURE__*/_interopDefaultLegacy(statics);
var HexoCore__default = /*#__PURE__*/_interopDefaultLegacy(HexoCore);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

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

const defaultRoot = path.resolve(process.cwd(), "data");
const defaultFilename = "database.json";
let StorageService = class StorageService {
    _db;
    _root = defaultRoot;
    _filename = defaultFilename;
    constructor() {
        if (!fs.existsSync(this._root))
            fs.mkdirSync(this._root);
        this._db = new JSONdb__default['default'](path.resolve(this._root, this._filename));
    }
    get(key) {
        return this._db.get(key);
    }
    set(key, value) {
        return this._db.set(key, value);
    }
    delete(key) {
        return this._db.delete(key);
    }
};
StorageService = __decorate([
    tsyringe.singleton(),
    __metadata("design:paramtypes", [])
], StorageService);
const StorageServiceIdentifier = "StorageService";

const DEV = process.env.NODE_ENV !== "production";
function createDebug(scope) {
    return Debug__default['default'](`hexon-server:${scope}`);
}
function createErrorReporter(name = "Unknown") {
    return (message) => {
        const err = new Error(message);
        err.name = name + "Error";
        throw err;
    };
}
class ResponseError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
const debugEnd = createDebug("end");
function end(status, message) {
    debugEnd(`${message}`);
    const err = new ResponseError(status, message);
    err.status = status;
    throw err;
}
function resolveAuthorizationHeader(ctx) {
    if (!ctx.header || !ctx.header.authorization) {
        end(400, "auth header required");
    }
    const parts = ctx.header.authorization.split(" ");
    if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
            return credentials;
        }
    }
    end(400, "Authtication Error");
}
function check(err, query, code, message = err.message) {
    if (err.message.indexOf(query) > -1)
        end(code, message);
}

const error$1 = createErrorReporter("TokenService");
const TOKEN_KEY = "base-tokens-expired";
const defaultSecurity = {
    expire: "1h",
    refresh: "7d",
    secret: "secret",
};
let TokenService = class TokenService {
    _storage;
    _security = defaultSecurity;
    constructor(_storage) {
        this._storage = _storage;
    }
    setSecurity(security) {
        this._security = security;
    }
    sign(payload, type) {
        return jwt__namespace.sign({ ...payload, random: Math.random().toString(), type }, this._security.secret, {
            expiresIn: type === "access" ? this._security.expire : this._security.refresh,
        });
    }
    verifyToken(token, type) {
        if (type) {
            const decoded = jwt__namespace.decode(token);
            if (decoded.type !== type)
                error$1(`require ${type} token`);
        }
        jwt__namespace.verify(token, this._security.secret);
        const tokens = this._storage.get(TOKEN_KEY) || [];
        if (tokens.find((t) => t === token))
            error$1("token expired");
    }
    getTokenType(token) {
        const decoded = jwt__namespace.decode(token);
        return decoded.type;
    }
    getPayload(token) {
        return jwt__namespace.decode(token);
    }
    getTokens(payload) {
        const access = this.sign(payload, "access");
        const refresh = this.sign(payload, "refresh");
        return { access, refresh };
    }
    refreshTokens(token) {
        this.verifyToken(token, "refresh");
        const payload = jwt__namespace.decode(token);
        delete payload.type;
        delete payload.random;
        delete payload.exp;
        delete payload.iat;
        const access = this.sign(payload, "access");
        const refresh = this.sign(payload, "refresh");
        this.expireToken(token);
        return { access, refresh };
    }
    expireToken(refreshToken) {
        this.verifyToken(refreshToken, "refresh");
        const tokens = this._storage.get(TOKEN_KEY) || [];
        tokens.push(refreshToken);
        this._storage.set(TOKEN_KEY, tokens);
    }
};
TokenService = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageServiceIdentifier)),
    __metadata("design:paramtypes", [Object])
], TokenService);
const TokenServiceIdentifier = "TokenService";

/**
 * setup polyfill
 */
/**
 * setup di
 * @see https://github.com/microsoft/tsyringe
 */
tsyringe.container.register(StorageServiceIdentifier, {
    useClass: StorageService,
});
tsyringe.container.register(TokenServiceIdentifier, {
    useClass: TokenService,
});

const error = createErrorReporter("UserService");
const USERS_KEY = "admin-users";
let UserService = class UserService {
    _storage;
    _tokenService;
    constructor(_storage, _tokenService) {
        this._storage = _storage;
        this._tokenService = _tokenService;
    }
    _getUsers() {
        return this._storage.get(USERS_KEY) || [];
    }
    _getUser(username) {
        const users = this._getUsers();
        return users.find((user) => user.username === username);
    }
    _setUser(username, info) {
        const users = this._getUsers();
        const old = this._getUser(username);
        users[users.indexOf(old)] = { ...old, ...info };
        return this.getUserInfo(username);
    }
    getUserInfo(username) {
        const users = this._getUsers();
        const user = users.find((user) => user.username === username);
        const { password, ...rest } = user;
        return rest;
    }
    addUser(username, password) {
        // default password is admin SHA1('admin').toString()
        const users = this._getUsers();
        // TODO: use salt
        users.push({ username, password: cryptoJs.SHA1(password).toString() });
        this._storage.set(USERS_KEY, users);
    }
    signIn(username, password) {
        const user = this._getUser(username);
        if (!user)
            error("user not found");
        if (user.password !== cryptoJs.SHA1(password).toString())
            error("wrong username or password");
        const tokens = this._tokenService.getTokens({ username });
        return { ...this.getUserInfo(username), ...tokens };
    }
    signUp(username, password) {
        if (this._getUser(username))
            error("user exists");
        this.addUser(username, password);
        const tokens = this._tokenService.getTokens({ username });
        return { ...this.getUserInfo(username), ...tokens };
    }
    verify(accessToken) {
        this._tokenService.verifyToken(accessToken, "access");
        const type = this._tokenService.getTokenType(accessToken);
        if (type !== "access")
            error("require access token");
    }
    refresh(refreshToken) {
        return this._tokenService.refreshTokens(refreshToken);
    }
    signOff(refreshToken) {
        this._tokenService.expireToken(refreshToken);
    }
    getInfo(token) {
        this._tokenService.verifyToken(token, "access");
        const { username } = this._tokenService.getPayload(token);
        return this.getUserInfo(username);
    }
    updateInfo(token, info) {
        const { username } = this._tokenService.getPayload(token);
        return this._setUser(username, info);
    }
};
UserService = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageServiceIdentifier)),
    __param(1, tsyringe.inject(TokenServiceIdentifier)),
    __metadata("design:paramtypes", [Object, Object])
], UserService);

// 只能使用 base services
const tokenService = tsyringe.container.resolve(TokenService);
async function requireAccessToken(ctx, next) {
    const token = resolveAuthorizationHeader(ctx);
    if (!token)
        end(400, "require bearer token");
    try {
        tokenService.verifyToken(token, "access");
    }
    catch (err) {
        if (err.message.includes("invalid signature"))
            end(401, "invalid signature");
        if (err.name === "TokenExpiredError")
            end(401, "token expired");
        else
            throw err;
    }
    await next();
}

createDebug("app:admin");
const userService = tsyringe.container.resolve(UserService);
const router$3 = new Router__default['default']();
router$3.post("/signin", (ctx) => {
    const user = auth__default['default'].parse(ctx.request.headers.authorization);
    if (!user)
        end(401, "basic auth is required");
    let info;
    try {
        info = userService.signIn(user.name, user.pass);
    }
    catch (err) {
        check(err, "user not found", 401);
        throw err;
    }
    ctx.body = info;
});
// /**
//  * just set in databast.json
//   {
//       "username": "admin",
//       "password": "7b2e9f54cdff413fcde01f330af6896c3cd7e6cd",
//        // admin
//        // SHA1('admin') = d033e22ae348aeb5660fc2140aec35850c4da997
//   }
//   */
// router.post("/signup", (ctx: CustomContext) => {
//   const { username, password } = (ctx.request as CustomRequest).body;
//   if (!username || !password) end(400, "invalid params");
//   let info;
//   try {
//     info = userService.signUp(username, password);
//   } catch (err) {
//     check(err, "exists", 401);
//     throw err;
//   }
//   ctx.body = info;
// });
router$3.post("/refresh", (ctx) => {
    const token = resolveAuthorizationHeader(ctx);
    let info;
    try {
        info = userService.refresh(token);
    }
    catch (err) {
        check(err, "expired", 401);
        check(err, "require refresh token", 400);
        throw err;
    }
    ctx.body = info;
});
router$3.get("/info", requireAccessToken, (ctx) => {
    const token = resolveAuthorizationHeader(ctx);
    ctx.body = userService.getInfo(token);
});

const app$4 = new Koa__default['default']();
app$4.use(mount__default['default']("/", statics__default['default'](path__default['default'].resolve(__dirname, "../../../../web/dist/pwa"))));
app$4.use(router$3.routes());
app$4.use(router$3.allowedMethods());

const app$3 = new Koa__default['default']();
const router$2 = new Router__default['default']();
router$2.get("/", (ctx) => {
    ctx.status = 404;
});
app$3.use(router$2.routes());
app$3.use(router$2.allowedMethods());

const router$1 = new Router__default['default']();
router$1.get("/", (ctx) => {
    ctx.status = 200;
});
const app$2 = new Koa__default['default']();
app$2.use(router$1.routes());
app$2.use(router$1.allowedMethods());

const HEXO_BASE_DIR_KEY = "hexo-basedir";
const HEXO_OPTIONS_KEY = "hexo-options";

const toPost = (post) => post;
const toPage = (post) => post;
const toCategory = (post) => post;
const toTag = (post) => post;

const debug = createDebug("hexo");
let Hexo = class Hexo {
    _storage;
    _hexo = null;
    _base_dir = null;
    _options = null;
    _ready = false;
    constructor(_storage) {
        this._storage = _storage;
    }
    async init() {
        const bak = { base_dir: this._base_dir, options: this._options };
        this._base_dir = this._storage.get(HEXO_BASE_DIR_KEY);
        if (!this._base_dir)
            throw new Error("must have hexo base dir");
        try {
            const data = fs__default['default']
                .readFileSync(path__default['default'].resolve(this._base_dir, "package.json"))
                .toString();
            const parsed = JSON.parse(data);
            if (!parsed?.dependencies?.hexo)
                throw new Error(`${this._base_dir} is not a hexo blog`);
        }
        catch (_) {
            throw new Error(`${this._base_dir} is not a hexo blog`);
        }
        this._options =
            this._storage.get(HEXO_OPTIONS_KEY);
        this._options.silent = DEV ? false : this._options.silent;
        this._hexo = new HexoCore__default['default'](this._base_dir, this._options);
        try {
            await this._hexo.init();
            await this._hexo.watch();
            this._ready = true;
            debug("ready to go");
        }
        catch (err) {
            debug("hexo init fail");
            this._hexo = bak.base_dir
                ? new HexoCore__default['default'](bak.base_dir, bak.options)
                : null;
            this._base_dir = bak.base_dir;
            this._options = bak.options;
            if (this._base_dir)
                debug(`using old base dir: ${this._base_dir}`);
            try {
                await this._hexo.init();
            }
            catch (e) {
                debug("fail to reset HexoCore");
                throw e;
            }
            throw err;
        }
    }
    async listPost() {
        const docs = this._hexo.locals.get("posts").toArray().map(toPost);
        return docs.map((postDoc) => ({
            ...postDoc,
            date: postDoc?.date.valueOf(),
            updated: postDoc?.updated.valueOf(),
            prev: postDoc?.prev?._id,
            next: postDoc?.next?._id,
            tags: postDoc.tags.data.map((t) => ({
                ...t,
                posts: t.posts.map((p) => p._id),
            })),
            categories: postDoc?.categories.data.map((c) => ({
                ...c,
                posts: c.posts.map((p) => p._id),
            })),
        }));
    }
    async listPage() {
        const docs = this._hexo.locals.get("pages").toArray().map(toPage);
        return docs.map((pageDoc) => ({
            ...pageDoc,
            date: pageDoc?.date.valueOf(),
            updated: pageDoc?.updated.valueOf(),
            prev: pageDoc?.prev?._id,
            next: pageDoc?.next?._id,
        }));
    }
    async listCategory() {
        const docs = this._hexo.locals.get("categories").toArray().map(toCategory);
        return docs.map((categoryDoc) => ({
            ...categoryDoc,
            posts: categoryDoc.posts.map((p) => p._id),
        }));
    }
    async listTag() {
        const docs = this._hexo.locals.get("categories").toArray().map(toTag);
        return docs.map((tagDoc) => ({
            ...tagDoc,
            posts: tagDoc.posts.map((p) => p._id),
        }));
    }
};
Hexo = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageServiceIdentifier)),
    __metadata("design:paramtypes", [Object])
], Hexo);
var Hexo$1 = Hexo;

const storage = tsyringe.container.resolve(StorageService);
const hexo = tsyringe.container.resolve(Hexo$1);
if (storage.get(HEXO_BASE_DIR_KEY))
    hexo.init().catch((err) => {
        console.log(chalk__default['default'].red("Fail to initialize hexo, waiting for retry:"));
        console.log(chalk__default['default'].red(err.message));
    });
const app$1 = new Koa__default['default']();
const router = new Router__default['default']();
router.get("/", (ctx) => {
    ctx.status = 404;
});
app$1.use(router.routes());
app$1.use(router.allowedMethods());

/**
 * config app entrance
 */
var entry = compose__default['default']([
    mount__default['default']("/", app$4),
    mount__default['default']("/install", app$3),
    mount__default['default']("/health", app$2),
    mount__default['default']("/hexo", app$1),
]);

/**
 * main app
 *
 * - polyfill ready
 * - di ready
 */

const app = new Koa__default['default']();

onerror__default['default'](app);
app.use(cors__default['default']());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    if (ctx.status === 500) {
      ctx.body = { message: DEV ? err : "server internal error" };
      console.error(err);
    } else ctx.body = { message: err.message };
  }
});

app.use(logger__default['default']());

app.use(
  koaBody__default['default']({
    enableTypes: ["json", "form", "text"],
  })
);

app.use(entry);

const server = http__default['default'].createServer(app.callback());
server.on("listening", () => {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
  console.log("Server running on " + bind);
});
server.listen(5777);
