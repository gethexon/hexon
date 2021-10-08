'use strict';

require('reflect-metadata');
var tsyringe = require('tsyringe');
var fs = require('fs');
var path = require('path');
var JSONdb = require('simple-json-db');
var http = require('http');
var Koa = require('koa');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser');
var onerror = require('koa-onerror');
var cors = require('@koa/cors');
var compose = require('koa-compose');
var mount = require('koa-mount');
var Router = require('@koa/router');
var HexoCore = require('hexo');
var Debug = require('debug');
var chalk = require('chalk');
var koaSimpleAccount = require('@winwin/koa-simple-account');
var serve = require('koa-static');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var JSONdb__default = /*#__PURE__*/_interopDefaultLegacy(JSONdb);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var logger__default = /*#__PURE__*/_interopDefaultLegacy(logger);
var bodyParser__default = /*#__PURE__*/_interopDefaultLegacy(bodyParser);
var onerror__default = /*#__PURE__*/_interopDefaultLegacy(onerror);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var compose__default = /*#__PURE__*/_interopDefaultLegacy(compose);
var mount__default = /*#__PURE__*/_interopDefaultLegacy(mount);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var HexoCore__default = /*#__PURE__*/_interopDefaultLegacy(HexoCore);
var Debug__default = /*#__PURE__*/_interopDefaultLegacy(Debug);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var serve__default = /*#__PURE__*/_interopDefaultLegacy(serve);

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
const defaultFilename = "common.db";
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

const DEV = process.env.NODE_ENV !== "production";
function createDebug(scope) {
    return Debug__default['default'](`hexon-server:${scope}`);
}

const HEXO_BASE_DIR_KEY = "hexo-basedir";
const HEXO_OPTIONS_KEY = "hexo-options";

const toPost = (post) => post;
const toPage = (post) => post;
const toCategory = (post) => post;
const toTag = (post) => post;

const debug = createDebug("hexo");
let Hexo = class Hexo {
    _storage;
    //#region init
    _hexo = null;
    _base_dir = null;
    _options = null;
    _ready = false;
    constructor(_storage) {
        this._storage = _storage;
    }
    async init() {
        const bak = { base_dir: this._base_dir, options: this._options };
        this._base_dir = path__default['default'].resolve(__dirname, DEV ? "../../" : "", "../../../", this._storage.get(HEXO_BASE_DIR_KEY));
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
            this._storage.get(HEXO_OPTIONS_KEY) || {};
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
    //#endregion
    //#region IHexoAPI
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
            parent: categoryDoc.parent || "top",
        }));
    }
    async listTag() {
        const docs = this._hexo.locals.get("categories").toArray().map(toTag);
        return docs.map((tagDoc) => ({
            ...tagDoc,
            posts: tagDoc.posts.map((p) => p._id),
        }));
    }
    //#endregion
    //#region IHexoCommand
    async deploy(options = {}) {
        const { generate = false } = options;
        const args = [];
        if (generate)
            args.push("--generate");
        await this._hexo.call("deploy", { _: args });
    }
    async generate(options = {}) {
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
        if (concurrency)
            args.push("--concurrency");
        await this._hexo.call("generate", { _: args });
    }
    async clean() {
        await this._hexo.call("clean");
    }
};
Hexo = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageServiceIdentifier)),
    __metadata("design:paramtypes", [Object])
], Hexo);
var Hexo$1 = Hexo;

const router = new Router__default['default']();
router.get("/posts", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    ctx.body = await hexo.listPost();
});
router.get("/pages", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    ctx.body = await hexo.listPage();
});
router.get("/tags", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    ctx.body = await hexo.listTag();
});
router.get("/categories", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    ctx.body = await hexo.listCategory();
});
router.post("/deploy", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    await hexo.deploy(ctx.request.body);
    ctx.status = 200;
});
router.post("/generate", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    await hexo.generate(ctx.request.body);
    ctx.status = 200;
});
router.post("/clean", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    await hexo.clean();
    ctx.status = 200;
});

const account = koaSimpleAccount.createSimpleAccount({
    path: path__default['default'].resolve(__dirname, "../data/account.db"),
    secret: "secret",
    expiresIn: "10min",
    refreshableIn: "7d",
});

const storage = tsyringe.container.resolve(StorageService);
const hexo = tsyringe.container.resolve(Hexo$1);
if (storage.get(HEXO_BASE_DIR_KEY))
    hexo
        .init()
        .then(async () => {
        // This line for test only
    })
        .catch((err) => {
        console.log(chalk__default['default'].red("Fail to initialize hexo, waiting for retry:"));
        console.log(chalk__default['default'].red(err.message));
    });
const app$1 = new Koa__default['default']();
app$1.use(account.auth());
app$1.use(router.routes());
app$1.use(router.allowedMethods());

/**
 * config app entrance
 */
var apps = compose__default['default']([
    mount__default['default']("/install", app$3),
    mount__default['default']("/health", app$2),
    mount__default['default']("/", app$1),
]);

function statics(root) {
    return async (ctx, next) => {
        await serve__default['default'](root, {
            setHeaders: (res, fullpath, stats) => {
                const isHtml = path__default['default'].extname(fullpath).toLowerCase() === ".html";
                if (isHtml)
                    ctx.set("Cache-Control", "no-cache");
                else
                    ctx.set("Cache-Control", "max-age=31536000");
            },
        })(ctx, next);
    };
}

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
  bodyParser__default['default']({
    enableTypes: ["json", "form", "text"],
  })
);

app.use(mount__default['default']("/", statics(path__default['default'].resolve(__dirname, "../../hexon-web/dist"))));
app.use(account.middleware);

app.use(apps);

const server = http__default['default'].createServer(app.callback());
server.on("listening", () => {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
  console.log("Server running on " + bind);
});
server.listen(5777);
