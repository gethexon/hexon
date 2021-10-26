import path from "path";
import { default as HexoCore } from "hexo";
import { inject, injectable, singleton } from "tsyringe";
import { createDebug, DEV, expandHomeDir } from "../../utils";
import {
  IStorageService,
  StorageServiceIdentifier,
} from "../../services/storage";
import { BRIEF_LENGTH, HEXO_BASE_DIR_KEY, HEXO_OPTIONS_KEY } from "./constants";
import {
  HexoPage,
  HexoPost,
  run,
  toCategory,
  toPage,
  toPost,
  toTag,
} from "./utils";
import fs from "fs";
import { BriefPage, BriefPost, Category, Page, Post, Tag } from "./types";

declare module "hexo" {
  interface InstanceOptions {
    draft?: boolean;
    drafts?: boolean;
  }
}

const debug = createDebug("hexo");

interface IHexoAPI {
  listPost(): Promise<BriefPost[]>;
  listPage(): Promise<BriefPage[]>;
  listCategory(): Promise<Category[]>;
  listTag(): Promise<Tag[]>;
  getPostBySource(source: string): Promise<Post>;
  getPageBySource(source: string): Promise<Page>;
}

interface ICreateOptions {
  layout?: boolean;
  path?: boolean;
  slug?: boolean;
  replace?: boolean;
}

interface IHexoCommand {
  deploy(options?: IDeployOptions): Promise<void>;
  generate(): Promise<void>;
  clean(): Promise<void>;
}
interface IDeployOptions {
  generate?: boolean;
}

interface IGenerateOptions {
  deploy?: boolean;
  watch?: boolean;
  bail?: boolean;
  force?: boolean;
  concurrency?: boolean;
}

interface IHexoCli {
  // run with --config
  publish(source: string, layout?: string): Promise<Post>;
  // create(title: string, options?: ICreateOptions): Promise<void>; // new
  // update(): Promise<void>;
  // delete(): Promise<void>;
}

function transformPost(doc: HexoPost): Post {
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

function transformPostToBrief(doc: Post): BriefPost {
  const res = { ...doc, brief: doc._content.slice(0, BRIEF_LENGTH) };
  delete res._content;
  delete doc.content;
  delete doc.raw;
  return res;
}

function transformPage(doc: HexoPage) {
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

function transformPageToBrief(doc: Page): BriefPage {
  const res = { ...doc, brief: doc._content.slice(0, BRIEF_LENGTH) };
  delete res._content;
  delete res.content;
  delete res.raw;
  return res;
}

@injectable()
@singleton()
class Hexo implements IHexoAPI, IHexoCommand, IHexoCli {
  //#region init
  private _hexo: HexoCore = null;
  private _base_dir: string = null;
  private _options: HexoCore.InstanceOptions = null;
  private _ready: boolean = false;
  constructor(
    @inject(StorageServiceIdentifier) private _storage: IStorageService
  ) {}

  //#region helpers
  private withDraft(
    options: HexoCore.InstanceOptions
  ): HexoCore.InstanceOptions {
    return { ...options, draft: true, drafts: true };
  }

  private async runWithModifiedDraftOption(fn: (ctx: Hexo) => Promise<void>) {
    this._hexo = new HexoCore(this._base_dir, this._options);
    await this._hexo.init();
    await this._hexo.load();
    await fn(this);
    this._hexo = new HexoCore(this._base_dir, this.withDraft(this._options));
    await this._hexo.init();
    await this._hexo.load();
  }
  //#endregion

  public async init() {
    const bak = { base_dir: this._base_dir, options: this._options };
    this._base_dir = path.resolve(
      __dirname,
      DEV ? "../../" : "",
      "../../../",
      this._storage.get<string>(HEXO_BASE_DIR_KEY)
    );
    if (!this._base_dir) throw new Error("must have hexo base dir");
    try {
      const data = fs
        .readFileSync(path.resolve(this._base_dir, "package.json"))
        .toString();
      const parsed = JSON.parse(data);
      if (!parsed?.dependencies?.hexo)
        throw new Error(`${this._base_dir} is not a hexo blog`);
    } catch (_) {
      throw new Error(`${this._base_dir} is not a hexo blog`);
    }

    this._options =
      this._storage.get<HexoCore.InstanceOptions>(HEXO_OPTIONS_KEY) || {};
    this._options.silent = DEV ? false : this._options.silent;
    this._hexo = new HexoCore(this._base_dir, this.withDraft(this._options));

    try {
      await this._hexo.init();
      await this._hexo.watch();
      this._ready = true;
      debug("ready to go");
    } catch (err) {
      debug("hexo init fail");
      this._hexo = bak.base_dir
        ? new HexoCore(bak.base_dir, bak.options)
        : null;
      this._base_dir = bak.base_dir;
      this._options = bak.options;
      if (this._base_dir) debug(`using old base dir: ${this._base_dir}`);
      try {
        await this._hexo.init();
      } catch (e) {
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
      const post: BriefPost = transformPostToBrief(transformPost(postDoc));
      delete post.content;
      delete post._content;
      delete post.raw;
      delete post.more;
      return post;
    });
  }
  async getPostBySource(source: string) {
    const docs = this._hexo.locals.get("posts").toArray().map(toPost);
    const doc = docs.find((item) => item.source === source);
    if (!doc) throw new Error("not found");
    return transformPost(doc);
  }
  async listPage() {
    const docs = this._hexo.locals.get("pages").toArray().map(toPage);
    return docs.map((pageDoc) => {
      const page: BriefPage = transformPageToBrief(transformPage(pageDoc));
      delete page.content;
      delete page._content;
      delete page.raw;
      delete page.more;
      return page;
    });
  }
  async getPageBySource(source: string) {
    const docs = this._hexo.locals.get("pages").toArray().map(toPage);
    const doc = docs.find((item) => item.source === source);
    if (!doc) throw new Error("not found");
    return transformPage(doc);
  }
  async listCategory(): Promise<Category[]> {
    const docs = this._hexo.locals.get("categories").toArray().map(toCategory);
    return docs.map((categoryDoc) => ({
      ...categoryDoc,
      posts: categoryDoc.posts.map((p) => p.slug),
    }));
  }
  async listTag(): Promise<Tag[]> {
    const docs = this._hexo.locals.get("tags").toArray().map(toTag);
    return docs.map((tagDoc) => ({
      ...tagDoc,
      posts: tagDoc.posts.map((p) => p.slug),
    }));
  }
  //#endregion

  //#region IHexoCommand
  async deploy(options: IDeployOptions = {}) {
    const { generate = false } = options;
    const args: string[] = [];
    if (generate) args.push("--generate");
    this.runWithModifiedDraftOption(async (ctx) => {
      await ctx._hexo.call("deploy", { _: args });
    });
  }

  async generate(options: IGenerateOptions = {}) {
    const {
      deploy = false,
      watch = false,
      bail = false,
      force = false,
      concurrency = false,
    } = options;
    const args: string[] = [];
    if (deploy) args.push("--deploy");
    if (watch) args.push("--watch");
    if (bail) args.push("--bail");
    if (force) args.push("--force");
    this.runWithModifiedDraftOption(async (ctx) => {
      if (concurrency) args.push("--concurrency");
      await ctx._hexo.call("generate", { _: args });
    });
  }

  async clean() {
    this.runWithModifiedDraftOption(async (ctx) => {
      await ctx._hexo.call("clean");
    });
  }
  //#endregion

  //#region IHexoCli
  async publish(filename: string, layout?: string) {
    const info = await run(
      "hexo",
      ["publish"].concat(layout ? [layout] : []).concat([filename]),
      { cwd: this._base_dir }
    );
    await this._hexo.locals.invalidate();
    await this._hexo.load();
    const fullSource = expandHomeDir(info.split("Published: ")[1].trim());
    const post = this._hexo.locals
      .get("posts")
      .toArray()
      .find((item) => item.full_source === fullSource)!;
    return this.getPostBySource(post.source);
  }
  //#endregion
}

export default Hexo;
