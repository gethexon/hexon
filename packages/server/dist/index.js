'use strict';

require('reflect-metadata');
var tsyringe = require('tsyringe');
var http = require('http');
var fs = require('fs');
var path = require('path');
var JSONdb = require('simple-json-db');
var Koa = require('koa');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser');
var cors = require('@koa/cors');
var compose = require('koa-compose');
var mount = require('koa-mount');
var Router = require('@koa/router');
var koaSimpleAccount = require('@winwin/koa-simple-account');
var chalk = require('chalk');
var HexoCore = require('hexo');
var Debug = require('debug');
var execa = require('execa');
var NodeGit = require('nodegit');
var serve = require('koa-static');
var crypto = require('crypto');
var CryptoJS = require('crypto-js');
var JSEncrypt = require('node-jsencrypt');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var JSONdb__default = /*#__PURE__*/_interopDefaultLegacy(JSONdb);
var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var logger__default = /*#__PURE__*/_interopDefaultLegacy(logger);
var bodyParser__default = /*#__PURE__*/_interopDefaultLegacy(bodyParser);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var compose__default = /*#__PURE__*/_interopDefaultLegacy(compose);
var mount__default = /*#__PURE__*/_interopDefaultLegacy(mount);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var HexoCore__default = /*#__PURE__*/_interopDefaultLegacy(HexoCore);
var Debug__default = /*#__PURE__*/_interopDefaultLegacy(Debug);
var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);
var NodeGit__default = /*#__PURE__*/_interopDefaultLegacy(NodeGit);
var serve__default = /*#__PURE__*/_interopDefaultLegacy(serve);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var CryptoJS__default = /*#__PURE__*/_interopDefaultLegacy(CryptoJS);
var JSEncrypt__default = /*#__PURE__*/_interopDefaultLegacy(JSEncrypt);

const HEXO_BASE_DIR_KEY = "hexo-basedir";
const HEXO_OPTIONS_KEY = "hexo-options";
const BRIEF_LENGTH = 500;
const HEXON_PORT_KEY = "hexon-port";
const HEXON_DEFAULT_PORT = 5777;
const HEXON_ISINSTALL_KEY = "hexon-installed";

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

const account = koaSimpleAccount.createSimpleAccount({
    path: path__default["default"].resolve(process.cwd(), "data/account.db"),
    secret: "secret",
    expiresIn: "10min",
    refreshableIn: "7d",
    storage: tsyringe.container.resolve(StorageService),
});

let InstallService = class InstallService {
    _storage;
    constructor(_storage) {
        this._storage = _storage;
        if (!this._storage.get(HEXON_ISINSTALL_KEY))
            this._storage.set(HEXON_ISINSTALL_KEY, false);
    }
    isInstalled() {
        return this._storage.get(HEXON_ISINSTALL_KEY);
    }
    async install(options) {
        const { username, password, ...auth } = options;
        account.setUserInfo({ username, password });
        account.setAuthInfo(auth);
        this._storage.set(HEXON_ISINSTALL_KEY, true);
    }
};
InstallService = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageService)),
    __metadata("design:paramtypes", [Object])
], InstallService);

const app$4 = new Koa__default["default"]();
const router$3 = new Router__default["default"]();
const checkInstall = () => async (ctx, next) => {
    const service = tsyringe.container.resolve(InstallService);
    if (!service.isInstalled()) {
        ctx.status = 404;
        ctx.body = "Install required";
    }
    else
        await next();
};
router$3.get("/", (ctx) => {
    const service = tsyringe.container.resolve(InstallService);
    if (service.isInstalled()) {
        ctx.status = 404;
    }
    else {
        ctx.status = 200;
        ctx.body = "Waiting For Install";
    }
});
router$3.post("/", async (ctx) => {
    const service = tsyringe.container.resolve(InstallService);
    if (service.isInstalled()) {
        ctx.status = 404;
        return;
    }
    const { username, password, secret, expiresIn, refreshableIn } = ctx.request.body;
    if ([username, password, secret, expiresIn, refreshableIn].some((value) => !value))
        ctx.status = 400;
    else {
        await service.install({
            username,
            password,
            secret,
            expiresIn,
            refreshableIn,
        });
        ctx.status = 200;
    }
});
app$4.use(router$3.routes());
app$4.use(router$3.allowedMethods());

const router$2 = new Router__default["default"]();
router$2.get("/", (ctx) => {
    ctx.status = 200;
});
const app$3 = new Koa__default["default"]();
app$3.use(router$2.routes());
app$3.use(router$2.allowedMethods());

const DEV = process.env.NODE_ENV !== "production";
function createDebug(scope) {
    return Debug__default["default"](`hexon-server:${scope}`);
}
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

function isBlog(cwd) {
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
    if (!packageJSON?.dependencies?.hexo)
        return false;
    return true;
}
function toRealPath(value) {
    return path__default["default"].isAbsolute(value)
        ? value
        : path__default["default"].resolve(process.cwd(), "../..", value);
}

const toPost = (post) => post;
const toPage = (post) => post;
const toCategory = (post) => post;
const toTag = (post) => post;
async function run(command, args, opt) {
    return (await execa__default["default"](command, args, { ...opt, stdio: "pipe" })).stdout;
}

const debug = createDebug("hexo");
function transformPost(doc) {
    return {
        ...doc,
        slug: doc.slug,
        date: doc?.date.toString(),
        updated: doc?.updated.toString(),
        prev: doc?.prev?.source,
        next: doc?.next?.source,
        tags: doc.tags.data.map((t) => t.slug),
        categories: doc?.categories.data.map((c) => c.slug),
        brief: doc._content.slice(0, BRIEF_LENGTH),
    };
}
function transformPostToBrief(doc) {
    const res = { ...doc, brief: doc._content.slice(0, BRIEF_LENGTH) };
    delete res._content;
    delete doc.content;
    delete doc.raw;
    return res;
}
function transformPage(doc) {
    return {
        ...doc,
        slug: doc.slug,
        date: doc?.date.toString(),
        updated: doc?.updated.toString(),
        prev: doc?.prev?.source,
        next: doc?.next?.source,
        brief: doc._content.slice(0, BRIEF_LENGTH),
    };
}
function transformPageToBrief(doc) {
    const res = { ...doc, brief: doc._content.slice(0, BRIEF_LENGTH) };
    delete res._content;
    delete res.content;
    delete res.raw;
    return res;
}
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
    //#region helpers
    withModifiedOption(options) {
        return { ...options, draft: true, drafts: true };
    }
    async runWithoutModifiedOption(fn) {
        this._hexo = new HexoCore__default["default"](this._base_dir, this._options);
        await this._hexo.init();
        await this._hexo.load();
        await fn(this);
        this._hexo = new HexoCore__default["default"](this._base_dir, this.withModifiedOption(this._options));
        await this._hexo.init();
        await this._hexo.load();
    }
    getPostByFullSource(fullSource) {
        const post = this._hexo.locals
            .get("posts")
            .toArray()
            .find((item) => item.full_source === fullSource);
        return this.getPostBySource(post.source);
    }
    getPostOrPageByFullSource(fullSource) {
        const post = this._hexo.locals
            .get("posts")
            .toArray()
            .find((item) => item.full_source === fullSource);
        if (post)
            return this.getPostBySource(post.source);
        const page = this._hexo.locals
            .get("pages")
            .toArray()
            .find((item) => item.full_source === fullSource);
        return this.getPageBySource(page.source);
    }
    writeFile(fullPath, content) {
        try {
            fs__default["default"].writeFileSync(fullPath, content);
        }
        catch (e) {
            console.error(e);
            throw new Error("fail to write file");
        }
    }
    deleteFile(fullPath) {
        try {
            fs__default["default"].rmSync(fullPath);
        }
        catch (e) {
            console.error(e);
            throw new Error("fail to delete file");
        }
    }
    async reload() {
        await this._hexo.locals.invalidate();
        await this._hexo.load();
    }
    getFullPathBySource(source, type) {
        if (type === "post")
            return this._hexo.locals
                .get("posts")
                .toArray()
                .find((item) => item.source === source).full_source;
        else
            return this._hexo.locals
                .get("pages")
                .toArray()
                .find((item) => item.source === source).full_source;
    }
    async WithCategoriesTagsBriefArticleList(article) {
        const categories = await this.listCategory();
        const tags = await this.listTag();
        const pages = await this.listPage();
        const posts = await this.listPost();
        return { article, categories, tags, pages, posts };
    }
    //#endregion
    async init() {
        const bak = { base_dir: this._base_dir, options: this._options };
        const base = this._storage.get(HEXO_BASE_DIR_KEY);
        this._base_dir = path__default["default"].resolve(__dirname, toRealPath(base));
        if (!this._base_dir)
            throw new Error("must have hexo base dir");
        if (!isBlog(this._base_dir)) {
            throw new Error(`${this._base_dir} is not a hexo blog`);
        }
        this._options =
            this._storage.get(HEXO_OPTIONS_KEY) || {};
        this._options.silent = DEV ? false : this._options.silent;
        this._hexo = new HexoCore__default["default"](this._base_dir, this.withModifiedOption(this._options));
        try {
            await this._hexo.init();
            await this._hexo.watch();
            this._ready = true;
            debug("ready to go");
        }
        catch (err) {
            debug("hexo init fail");
            this._hexo = bak.base_dir ? new HexoCore__default["default"](bak.base_dir, bak.options) : null;
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
        return docs.map((postDoc) => {
            const post = transformPostToBrief(transformPost(postDoc));
            delete post.content;
            delete post._content;
            delete post.raw;
            delete post.more;
            return post;
        });
    }
    async getPostBySource(source) {
        const docs = this._hexo.locals.get("posts").toArray().map(toPost);
        const doc = docs.find((item) => item.source === source);
        if (!doc)
            throw new Error("not found");
        return transformPost(doc);
    }
    async listPage() {
        const docs = this._hexo.locals.get("pages").toArray().map(toPage);
        return docs.map((pageDoc) => {
            const page = transformPageToBrief(transformPage(pageDoc));
            delete page.content;
            delete page._content;
            delete page.raw;
            delete page.more;
            return page;
        });
    }
    async getPageBySource(source) {
        const docs = this._hexo.locals.get("pages").toArray().map(toPage);
        const doc = docs.find((item) => item.source === source);
        if (!doc)
            throw new Error("not found");
        return transformPage(doc);
    }
    async listCategory() {
        const docs = this._hexo.locals.get("categories").toArray().map(toCategory);
        return docs.map((categoryDoc) => ({
            ...categoryDoc,
            posts: categoryDoc.posts.map((p) => p.slug),
        }));
    }
    async listTag() {
        const docs = this._hexo.locals.get("tags").toArray().map(toTag);
        return docs.map((tagDoc) => ({
            ...tagDoc,
            posts: tagDoc.posts.map((p) => p.slug),
        }));
    }
    //#endregion
    //#region IHexoCommand
    async deploy(options = {}) {
        const { generate = false } = options;
        const args = [];
        if (generate)
            args.push("--generate");
        this.runWithoutModifiedOption(async (ctx) => {
            await ctx._hexo.call("deploy", { _: args });
        });
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
        this.runWithoutModifiedOption(async (ctx) => {
            if (concurrency)
                args.push("--concurrency");
            await ctx._hexo.call("generate", { _: args });
        });
    }
    async clean() {
        this.runWithoutModifiedOption(async (ctx) => {
            await ctx._hexo.call("clean");
        });
    }
    //#endregion
    //#region IHexoCli
    async publish(filename, layout) {
        const args = ["publish"];
        if (layout)
            args.push(layout);
        args.push(filename);
        const info = await run("hexo", args, { cwd: this._base_dir });
        await this.reload();
        const fullSource = expandHomeDir(info.split("Published: ")[1].trim());
        const article = await this.getPostByFullSource(fullSource);
        return this.WithCategoriesTagsBriefArticleList(article);
    }
    async create(title, options) {
        const args = ["new"];
        if (options.layout)
            args.push(options.layout);
        if (options.path) {
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
        const info = await run("hexo", args, { cwd: this._base_dir });
        await this.reload();
        const fullSource = expandHomeDir(info.split("Created: ")[1].trim());
        const article = await this.getPostOrPageByFullSource(fullSource);
        return this.WithCategoriesTagsBriefArticleList(article);
    }
    async update(source, raw, type) {
        if (type === "post") {
            const fullPath = this.getFullPathBySource(source, "post");
            if (!fullPath)
                throw new Error("not found");
            this.writeFile(fullPath, raw);
            await this.reload();
            const article = await this.getPostBySource(source);
            return this.WithCategoriesTagsBriefArticleList(article);
        }
        else {
            const fullPath = this.getFullPathBySource(source, "page");
            if (!fullPath)
                throw new Error("not found");
            this.writeFile(fullPath, raw);
            await this.reload();
            const article = await this.getPageBySource(source);
            return this.WithCategoriesTagsBriefArticleList(article);
        }
    }
    async delete(source, type) {
        if (type === "post") {
            const fullPath = this.getFullPathBySource(source, "post");
            if (!fullPath)
                throw new Error("not found");
            this.deleteFile(fullPath);
            await this.reload();
            return this.WithCategoriesTagsBriefArticleList(null);
        }
        else {
            const fullPath = this.getFullPathBySource(source, "page");
            if (!fullPath)
                throw new Error("not found");
            this.deleteFile(fullPath);
            await this.reload();
            return this.WithCategoriesTagsBriefArticleList(null);
        }
    }
};
Hexo = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageService)),
    __metadata("design:paramtypes", [Object])
], Hexo);
var Hexo$1 = Hexo;

const router$1 = new Router__default["default"]();
router$1.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        if (err instanceof Error && err.message === "not found") {
            ctx.status = 404;
        }
        else
            throw err;
    }
});
router$1.get("/posts", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    ctx.body = await hexo.listPost();
});
router$1.get("/post/:source", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    const { source } = ctx.params;
    if (!source) {
        ctx.status = 400;
        ctx.body = "need `source`";
    }
    ctx.body = await hexo.getPostBySource(decodeURIComponent(source));
});
router$1.get("/pages", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    ctx.body = await hexo.listPage();
});
router$1.get("/page/:source", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    const { source } = ctx.params;
    if (!source) {
        ctx.status = 400;
        ctx.body = "need `source`";
    }
    ctx.body = await hexo.getPageBySource(decodeURIComponent(source));
});
router$1.get("/tags", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    ctx.body = await hexo.listTag();
});
router$1.get("/categories", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    ctx.body = await hexo.listCategory();
});
router$1.post("/deploy", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    await hexo.deploy(ctx.request.body);
    ctx.status = 200;
});
router$1.post("/generate", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    await hexo.generate(ctx.request.body);
    ctx.status = 200;
});
router$1.post("/clean", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    await hexo.clean();
    ctx.status = 200;
});
router$1.post("/publish", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    const { filename, layout } = ctx.request.body;
    if (!filename) {
        ctx.status = 400;
        ctx.body = "need `filename`";
        return;
    }
    ctx.body = await hexo.publish(filename, layout);
});
router$1.post("/create", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    const { title, layout, path, slug, replace } = ctx.request.body;
    if (!title) {
        ctx.status = 400;
        ctx.body = "need `title`";
        return;
    }
    ctx.body = await hexo.create(title, { layout, path, slug, replace });
});
router$1.put("/post/:source", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    const { source } = ctx.params;
    const { raw } = ctx.request.body;
    if (!source || !raw) {
        ctx.status = 400;
        ctx.body = "need `source` and `raw`";
        return;
    }
    ctx.body = await hexo.update(source, raw, "post");
});
router$1.put("/page/:source", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    const { source } = ctx.params;
    const { raw } = ctx.request.body;
    if (!source || !raw) {
        ctx.status = 400;
        ctx.body = "need `source` and `raw`";
        return;
    }
    ctx.body = await hexo.update(source, raw, "page");
});
router$1.delete("/post/:source", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    const { source } = ctx.params;
    if (!source) {
        ctx.status = 400;
        ctx.body = "need `source` ";
        return;
    }
    ctx.body = await hexo.delete(source, "post");
});
router$1.delete("/page/:source", async (ctx) => {
    const hexo = tsyringe.container.resolve(Hexo$1);
    const { source } = ctx.params;
    if (!source) {
        ctx.status = 400;
        ctx.body = "need `source` ";
        return;
    }
    ctx.body = await hexo.delete(source, "page");
});

const storage$1 = tsyringe.container.resolve(StorageService);
const hexo = tsyringe.container.resolve(Hexo$1);
if (storage$1.get(HEXO_BASE_DIR_KEY))
    hexo
        .init()
        .then(async () => {
        // This line for test only
    })
        .catch((err) => {
        console.log(chalk__default["default"].red("Fail to initialize hexo, waiting for retry:"));
        console.log(chalk__default["default"].red(err.message));
        process.exit(1);
    });
const app$2 = new Koa__default["default"]();
app$2.use(account.auth());
app$2.use(router$1.routes());
app$2.use(router$1.allowedMethods());

class ResetHardError extends Error {
    name = "ResetHardError";
}
class PullError extends Error {
    name = "PullError";
}
class AddAllError extends Error {
    name = "AddAllError";
}
class CreateCommitError extends Error {
    name = "CreateCommitError";
}
class PushError extends Error {
    name = "PushError";
}

async function openRepo(repoPath) {
    return await NodeGit__default["default"].Repository.open(repoPath);
}
async function isClean(cwd) {
    const repo = await openRepo(cwd);
    const status = await repo.getStatus();
    return !status.length;
}
async function hasRepo(repoPath) {
    return !!(await openRepo(repoPath).catch((err) => null));
}
async function hasRemtoe(repoPath) {
    const repo = await openRepo(repoPath);
    const remotes = await Promise.all((await NodeGit__default["default"].Remote.list(repo)).map((name) => {
        return NodeGit__default["default"].Remote.lookup(repo, name);
    }));
    return !!remotes.length;
}
let GitService = class GitService {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    async sync() {
        const base = this.storage.get(HEXO_BASE_DIR_KEY);
        const cwd = toRealPath(base);
        if (!(await hasRepo(cwd)))
            return;
        await run("git", ["reset", "--hard"], { cwd }).catch((err) => {
            console.error(err);
            throw new ResetHardError();
        });
        if (await hasRemtoe(cwd)) {
            await run("git", ["pull"], { cwd }).catch((err) => {
                console.error(err);
                throw new PullError();
            });
        }
    }
    async save() {
        const base = this.storage.get(HEXO_BASE_DIR_KEY);
        const cwd = toRealPath(base);
        if (!(await hasRepo(cwd)))
            return;
        if (await isClean(cwd))
            return;
        await run("git", ["add", ".", "--all"], { cwd }).catch((err) => {
            console.error(err);
            throw new AddAllError();
        });
        await run("git", ["commit", "-m", `server update ${new Date().toString()}`], { cwd }).catch((err) => {
            console.error(err);
            throw new CreateCommitError();
        });
        if (await hasRemtoe(cwd))
            await run("git", ["push"], { cwd }).catch((err) => {
                console.error(err);
                throw new PushError();
            });
    }
};
GitService = __decorate([
    tsyringe.injectable(),
    tsyringe.singleton(),
    __param(0, tsyringe.inject(StorageService)),
    __metadata("design:paramtypes", [StorageService])
], GitService);

const router = new Router__default["default"]();
router.use(async (ctx, next) => {
    try {
        await next();
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
});
router.post("/sync", async (ctx) => {
    const git = tsyringe.container.resolve(GitService);
    await git.sync();
    ctx.status = 200;
});
router.post("/save", async (ctx) => {
    const git = tsyringe.container.resolve(GitService);
    await git.save();
    ctx.status = 200;
});

const app$1 = new Koa__default["default"]();
app$1.use(account.auth());
app$1.use(router.routes());
app$1.use(router.allowedMethods());

/**
 * config app entrance
 */
var apps = compose__default["default"]([
    mount__default["default"]("/install", app$4),
    checkInstall(),
    mount__default["default"]("/health", app$3),
    mount__default["default"]("/hexo", app$2),
    mount__default["default"]("/git", app$1),
]);

function statics(root) {
    return async (ctx, next) => {
        await serve__default["default"](root, {
            setHeaders: (res, fullpath, stats) => {
                const isHtml = path__default["default"].extname(fullpath).toLowerCase() === ".html";
                if (isHtml)
                    ctx.set("Cache-Control", "no-cache");
                else
                    ctx.set("Cache-Control", "max-age=31536000");
            },
        })(ctx, next);
    };
}

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
    return async (ctx, next) => {
        if (typeof enable === "function" ? !enable() : !enable) {
            await next();
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
            await next();
            const content = encryptAES(stringifyData({ data: ctx.body }), key);
            ctx.body = { content };
        }
        else {
            await next();
            return;
        }
    };
}

const app = new Koa__default["default"]();
app.use(cors__default["default"]());
app.use(async (ctx, next) => {
    try {
        await next();
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
});
app.use(bodyParser__default["default"]({
    enableTypes: ["json", "form", "text"],
}));
app.use(secure());
app.use(logger__default["default"]());
app.use(mount__default["default"]("/", statics(path__default["default"].resolve(process.cwd(), "../hexon-web/dist"))));
app.use(account.middleware);
app.use(apps);

const storage = tsyringe.container.resolve(StorageService);
const server = http__default["default"].createServer(app.callback());
server.on("listening", () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
    console.log("Server running on " + bind);
});
server.listen(storage.get(HEXON_PORT_KEY) || HEXON_DEFAULT_PORT);
