import path from "path";
import { default as HexoCore } from "hexo";
import { createDebug, DEV } from "../../../utils";
import { inject, injectable, singleton, container } from "tsyringe";
import {
  IStorageService,
  StorageServiceIdentifier,
} from "../../../services/storage";
import { HEXO_BASE_DIR_KEY, HEXO_OPTIONS_KEY } from "../../constants";
import { toCategory, toPage, toPost, toTag } from "./transformTypes";
import fs from "fs";

const debug = createDebug("hexo");

export interface Article {
  _id: string;
  title: string;
  date: number;
  updated?: number | undefined;
  comments: boolean;
  layout: string;
  content: string;
  excerpt?: string | undefined;
  more?: string | undefined;
  source: string;
  full_source: string;
  path: string;
  permalink: string;
  prev?: string | undefined; // _id
  next?: string | undefined; // _id
  raw?: string | undefined;
  photos?: string[] | undefined;
  link?: string | undefined;
  [key: string]: any;
}

interface Page extends Article {
  __page: boolean;
}

export interface Post extends Article {
  published?: boolean | undefined;
  categories?: Category[] | undefined;
  tags: Tag[];
  __post: boolean;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  path: string;
  permalink: string;
  posts: string[]; // _id
  length: number;
}
export interface Category extends Tag {
  parent: string;
}

interface IHexoAPI {
  listPost(): Promise<Post[]>;
  listPage(): Promise<Page[]>;
  listCategory(): Promise<Category[]>;
  listTag(): Promise<Tag[]>;
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
  // publish(): Promise<void>;
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
  create(title: string, options?: ICreateOptions): Promise<void>; // new
  update(): Promise<void>;
  delete(): Promise<void>;
}

@injectable()
@singleton()
class Hexo implements IHexoAPI, IHexoCommand {
  //#region init
  private _hexo: HexoCore = null;
  private _base_dir: string = null;
  private _options: HexoCore.InstanceOptions = null;
  private _ready: boolean = false;
  constructor(
    @inject(StorageServiceIdentifier) private _storage: IStorageService
  ) {}
  public async init() {
    const bak = { base_dir: this._base_dir, options: this._options };

    this._base_dir = this._storage.get<string>(HEXO_BASE_DIR_KEY);
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
      this._storage.get<HexoCore.InstanceOptions>(HEXO_OPTIONS_KEY);
    this._options.silent = DEV ? false : this._options.silent;
    this._hexo = new HexoCore(this._base_dir, this._options);

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
  async listPost(): Promise<Post[]> {
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
  async listPage(): Promise<Page[]> {
    const docs = this._hexo.locals.get("pages").toArray().map(toPage);
    return docs.map((pageDoc) => ({
      ...pageDoc,
      date: pageDoc?.date.valueOf(),
      updated: pageDoc?.updated.valueOf(),
      prev: pageDoc?.prev?._id,
      next: pageDoc?.next?._id,
    }));
  }
  async listCategory(): Promise<Category[]> {
    const docs = this._hexo.locals.get("categories").toArray().map(toCategory);
    return docs.map((categoryDoc) => ({
      ...categoryDoc,
      posts: categoryDoc.posts.map((p) => p._id),
    }));
  }
  async listTag(): Promise<Tag[]> {
    const docs = this._hexo.locals.get("categories").toArray().map(toTag);
    return docs.map((tagDoc) => ({
      ...tagDoc,
      posts: tagDoc.posts.map((p) => p._id),
    }));
  }
  //#endregion

  //#region IHexoCommand
  async deploy(options: IDeployOptions = {}) {
    const { generate = false } = options;
    const args: string[] = [];
    if (generate) args.push("--generate");
    await this._hexo.call("deploy", { _: args });
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
    if (concurrency) args.push("--concurrency");
    await this._hexo.call("generate", { _: args });
  }

  async clean() {
    await this._hexo.call("clean");
  }
  //#endregion
}

export default Hexo;