import path from "path";
import { default as HexoCore } from "hexo";
import { inject, injectable, singleton } from "tsyringe";
import fs from "fs";
import { createDebug, DEV, expandHomeDir } from "~/server/utils";
import {
  IStorageService,
  StorageServiceIdentifier,
} from "~/shared/storage-service";
import {
  HEXO_BASE_DIR_KEY,
  HEXO_OPTIONS_KEY,
  BRIEF_LENGTH,
} from "~/shared/constants";
import { isBlog, toRealPath } from "~/shared/utils";
import { BriefPage, BriefPost, Category, Page, Post, Tag } from "./types";
import {
  HexoPage,
  HexoPost,
  run,
  toCategory,
  toPage,
  toPost,
  toTag,
} from "./utils";

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
  layout?: string;
  path?: string;
  slug?: string;
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

interface WithCategoriesTagsBriefArticleList<T> {
  article: T;
  posts: BriefPost[];
  pages: BriefPage[];
  categories: Category[];
  tags: Tag[];
}

interface IHexoCli {
  publish(
    source: string,
    layout?: string
  ): Promise<WithCategoriesTagsBriefArticleList<Post>>;
  create(
    title: string,
    options?: ICreateOptions
  ): Promise<WithCategoriesTagsBriefArticleList<Post | Page>>;
  update(
    source: string,
    raw: string,
    type: "post" | "page"
  ): Promise<WithCategoriesTagsBriefArticleList<Post | Page>>;
  delete(
    source: string,
    type: "post" | "page"
  ): Promise<WithCategoriesTagsBriefArticleList<void>>;
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
  private withModifiedOption(
    options: HexoCore.InstanceOptions
  ): HexoCore.InstanceOptions {
    return { ...options, draft: true, drafts: true };
  }

  private async runWithoutModifiedOption(fn: (ctx: Hexo) => Promise<void>) {
    this._hexo = new HexoCore(this._base_dir, this._options);
    await this._hexo.init();
    await this._hexo.load();
    await fn(this);
    this._hexo = new HexoCore(
      this._base_dir,
      this.withModifiedOption(this._options)
    );
    await this._hexo.init();
    await this._hexo.load();
  }

  private getPostByFullSource(fullSource: string) {
    const post = this._hexo.locals
      .get("posts")
      .toArray()
      .find((item) => item.full_source === fullSource)!;
    return this.getPostBySource(post.source);
  }

  private getPostOrPageByFullSource(fullSource: string) {
    const post = this._hexo.locals
      .get("posts")
      .toArray()
      .find((item) => item.full_source === fullSource)!;
    if (post) return this.getPostBySource(post.source);
    const page = this._hexo.locals
      .get("pages")
      .toArray()
      .find((item) => item.full_source === fullSource)!;
    return this.getPageBySource(page.source);
  }

  private writeFile(fullPath: string, content: string) {
    try {
      fs.writeFileSync(fullPath, content);
    } catch (e) {
      console.error(e);
      throw new Error("fail to write file");
    }
  }

  private deleteFile(fullPath: string) {
    try {
      fs.rmSync(fullPath);
    } catch (e) {
      console.error(e);
      throw new Error("fail to delete file");
    }
  }

  private async reload() {
    await this._hexo.locals.invalidate();
    await this._hexo.load();
  }

  private getFullPathBySource(source: string, type: "post" | "page") {
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
  private async WithCategoriesTagsBriefArticleList<T>(
    article: T
  ): Promise<WithCategoriesTagsBriefArticleList<T>> {
    const categories = await this.listCategory();
    const tags = await this.listTag();
    const pages = await this.listPage();
    const posts = await this.listPost();
    return { article, categories, tags, pages, posts };
  }
  //#endregion

  public async init() {
    const bak = { base_dir: this._base_dir, options: this._options };
    const base = this._storage.get<string>(HEXO_BASE_DIR_KEY);
    this._base_dir = path.resolve(__dirname, toRealPath(base));
    if (!this._base_dir) throw new Error("must have hexo base dir");
    if (!isBlog(this._base_dir)) {
      throw new Error(`${this._base_dir} is not a hexo blog`);
    }

    this._options =
      this._storage.get<HexoCore.InstanceOptions>(HEXO_OPTIONS_KEY) || {};
    this._options.silent = DEV ? false : this._options.silent;
    this._hexo = new HexoCore(
      this._base_dir,
      this.withModifiedOption(this._options)
    );

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
  async getPostBySource(source: string): Promise<Post> {
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
  async getPageBySource(source: string): Promise<Page> {
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
    this.runWithoutModifiedOption(async (ctx) => {
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
    this.runWithoutModifiedOption(async (ctx) => {
      if (concurrency) args.push("--concurrency");
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
  async publish(filename: string, layout?: string) {
    const args: string[] = ["publish"];
    if (layout) args.push(layout);
    args.push(filename);
    const info = await run("hexo", args, { cwd: this._base_dir });
    await this.reload();
    const fullSource = expandHomeDir(info.split("Published: ")[1].trim());
    const article = await this.getPostByFullSource(fullSource);
    return this.WithCategoriesTagsBriefArticleList(article);
  }

  async create(title: string, options?: ICreateOptions) {
    const args: string[] = ["new"];
    if (options.layout) args.push(options.layout);
    if (options.path) {
      args.push("--path");
      args.push(options.path);
    }
    if (options.replace) args.push("--replace");
    if (options.slug) {
      args.push("--slug");
      args.push(options.slug);
    }
    if (title) args.push(title);
    const info = await run("hexo", args, { cwd: this._base_dir });
    await this.reload();
    const fullSource = expandHomeDir(info.split("Created: ")[1].trim());
    const article = await this.getPostOrPageByFullSource(fullSource);
    return this.WithCategoriesTagsBriefArticleList(article);
  }

  async update(
    source: string,
    raw: string,
    type: "post"
  ): Promise<WithCategoriesTagsBriefArticleList<Post>>;
  async update(
    source: string,
    raw: string,
    type: "page"
  ): Promise<WithCategoriesTagsBriefArticleList<Page>>;
  async update(source: string, raw: string, type: "post" | "page") {
    if (type === "post") {
      const fullPath = this.getFullPathBySource(source, "post");
      if (!fullPath) throw new Error("not found");
      this.writeFile(fullPath, raw);
      await this.reload();
      const article = await this.getPostBySource(source);
      return this.WithCategoriesTagsBriefArticleList(article);
    } else {
      const fullPath = this.getFullPathBySource(source, "page");
      if (!fullPath) throw new Error("not found");
      this.writeFile(fullPath, raw);
      await this.reload();
      const article = await this.getPageBySource(source);
      return this.WithCategoriesTagsBriefArticleList(article);
    }
  }

  async delete(
    source: string,
    type: "post" | "page"
  ): Promise<WithCategoriesTagsBriefArticleList<void>> {
    if (type === "post") {
      const fullPath = this.getFullPathBySource(source, "post");
      if (!fullPath) throw new Error("not found");
      this.deleteFile(fullPath);
      await this.reload();
      return this.WithCategoriesTagsBriefArticleList(null);
    } else {
      const fullPath = this.getFullPathBySource(source, "page");
      if (!fullPath) throw new Error("not found");
      this.deleteFile(fullPath);
      await this.reload();
      return this.WithCategoriesTagsBriefArticleList(null);
    }
  }
  //#endregion
}

export default Hexo;
