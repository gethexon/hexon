import path from "path"
import { inject, injectable, singleton } from "tsyringe"
import fs from "fs"
import HexoCore from "hexo"
import { BRIEF_LENGTH } from "~/shared/constants"
import {
  InvalidOptionsError,
  PostOrPageNotFoundError,
  ScriptError,
} from "@/errors"
import { HexoInstanceService } from "@/services/hexo-instance-service"
import { LogService } from "@/services/log-service"
import { BriefPage, BriefPost, Category, Page, Post, Tag } from "@/types/hexo"
import { expandHomeDir } from "@/utils"
import { run } from "@/utils/exec"
import {
  HexoPage,
  HexoPost,
  toCategory,
  toPage,
  toPost,
  toTag,
} from "@/utils/hexo"
import { scriptStore } from "~/shared/store"
import { ExecService } from "./exec-service"

interface IHexoAPI {
  listPost(): Promise<BriefPost[]>
  listPage(): Promise<BriefPage[]>
  listCategory(): Promise<Category[]>
  listTag(): Promise<Tag[]>
  getPostBySource(source: string): Promise<Post | undefined>
  getPageBySource(source: string): Promise<Page | undefined>
}

interface ICreateOptions {
  layout?: string
  path?: string
  slug?: string
  replace?: boolean
}

interface IHexoCommand {
  deploy(options?: IDeployOptions): Promise<void>
  generate(): Promise<void>
  clean(): Promise<void>
}
interface IDeployOptions {
  generate?: boolean
}

interface IGenerateOptions {
  deploy?: boolean
  watch?: boolean
  bail?: boolean
  force?: boolean
  concurrency?: boolean
}

interface WithCategoriesTagsBriefArticleList<T> {
  article: T
  posts: BriefPost[]
  pages: BriefPage[]
  categories: Category[]
  tags: Tag[]
}

interface IHexoCli {
  publish(
    source: string,
    layout?: string
  ): Promise<WithCategoriesTagsBriefArticleList<Post>>
  create(
    title: string,
    options?: ICreateOptions
  ): Promise<WithCategoriesTagsBriefArticleList<Post | Page>>
  update(
    source: string,
    raw: string,
    type: "post" | "page"
  ): Promise<WithCategoriesTagsBriefArticleList<Post | Page>>
  delete(
    source: string,
    type: "post" | "page"
  ): Promise<WithCategoriesTagsBriefArticleList<void>>
}

/**
 * A page object can be asset. e.g. css file. we need to filter it out.
 * @param pageOrAsset
 * @returns
 */
function isAsset(pageOrAsset: HexoPage) {
  return pageOrAsset.layout === "false"
}

function transformPost(doc: HexoPost): Post {
  return {
    ...doc,
    slug: doc.slug,
    date: doc.date.toString(),
    updated: doc.updated?.toString(),
    prev: doc.prev?.source,
    next: doc.next?.source,
    tags: doc.tags.data.map((t) => t.slug),
    categories: doc.categories?.data.map((c) => c.slug),
    brief: doc._content.slice(0, BRIEF_LENGTH),
  }
}

function transformPostToBrief({
  _content,
  content,
  raw,
  ...doc
}: Post): BriefPost {
  return { ...doc, brief: _content.slice(0, BRIEF_LENGTH) }
}

function transformPage(doc: HexoPage) {
  return {
    ...doc,
    slug: doc.slug,
    date: doc.date.toString(),
    updated: doc.updated?.toString(),
    prev: doc.prev?.source,
    next: doc.next?.source,
    brief: doc._content.slice(0, BRIEF_LENGTH),
  }
}

function transformPageToBrief({
  _content,
  content,
  raw,
  ...doc
}: Page): BriefPage {
  return { ...doc, brief: _content.slice(0, BRIEF_LENGTH) }
}

@injectable()
@singleton()
export class HexoService implements IHexoAPI, IHexoCommand, IHexoCli {
  constructor(
    @inject(LogService) private _logService: LogService,
    @inject(HexoInstanceService)
    private _hexoInstanceService: HexoInstanceService,
    @inject(ExecService) private _execService: ExecService
  ) {
    this._logService.setScope("hexo-service")
  }

  //#region helpers
  private async runWithoutModifiedOption(
    fn: (hexo: HexoCore) => Promise<void>
  ) {
    const { hexo, cleanup } =
      await this._hexoInstanceService.getInstanceWithOriginOptions()
    await fn(hexo)
    await cleanup()
  }

  private async getPostByFullSource(fullSource: string) {
    const hexo = await this._hexoInstanceService.getInstance()
    const post = hexo.locals
      .get("posts")
      .toArray()
      .find((item) => item.full_source === fullSource)!
    return this.getPostBySource(post.source)
  }

  private async getPostOrPageByFullSource(fullSource: string) {
    const hexo = await this._hexoInstanceService.getInstance()
    const post = hexo.locals
      .get("posts")
      .toArray()
      .find((item) => item.full_source === fullSource)!
    if (post) return this.getPostBySource(post.source)
    const page = hexo.locals
      .get("pages")
      .toArray()
      .find((item) => item.full_source === fullSource)!
    return this.getPageBySource(page.source)
  }

  private writeFile(fullPath: string, content: string) {
    try {
      fs.writeFileSync(fullPath, content)
    } catch (e) {
      this._logService.error("fail to write file")
      throw e
    }
  }

  private deleteFile(fullPath: string) {
    try {
      fs.rmSync(fullPath)
    } catch (e) {
      this._logService.error("fail to delete file")
      throw e
    }
  }

  private async getFullPathBySource(source: string, type: "post" | "page") {
    const hexo = await this._hexoInstanceService.getInstance()
    if (type === "post")
      return hexo.locals
        .get("posts")
        .toArray()
        .find((item) => item.source === source)?.full_source
    else
      return hexo.locals
        .get("pages")
        .toArray()
        .find((item) => item.source === source)?.full_source
  }

  private async WithCategoriesTagsBriefArticleList<T>(
    article: T
  ): Promise<WithCategoriesTagsBriefArticleList<T>> {
    const categories = await this.listCategory()
    const tags = await this.listTag()
    const pages = await this.listPage()
    const posts = await this.listPost()
    return { article, categories, tags, pages, posts }
  }
  //#endregion

  //#region IHexoAPI
  async listPost() {
    const hexo = await this._hexoInstanceService.getInstance()
    const docs = hexo.locals.get("posts").toArray().map(toPost)
    const res = docs.map((postDoc) => {
      const post: BriefPost = transformPostToBrief(transformPost(postDoc))
      delete post.content
      delete post._content
      delete post.raw
      delete post.more
      return post
    })
    this._logService.log("list post", res.length)
    return res
  }
  async getPostBySource(source: string): Promise<Post | undefined> {
    const hexo = await this._hexoInstanceService.getInstance()
    const docs = hexo.locals.get("posts").toArray().map(toPost)
    const doc = docs.find((item) => item.source === source)
    if (!doc) return
    const res = transformPost(doc)
    this._logService.log("get post by source", source)
    return res
  }
  async listPage() {
    const hexo = await this._hexoInstanceService.getInstance()
    const docs = hexo.locals
      .get("pages")
      .toArray()
      .map(toPage)
      .filter((doc) => !isAsset(doc))
    const res = docs.map((pageDoc) => {
      const page: BriefPage = transformPageToBrief(transformPage(pageDoc))
      delete page.content
      delete page._content
      delete page.raw
      delete page.more
      return page
    })
    this._logService.log("list page", res.length)
    return res
  }
  async getPageBySource(source: string): Promise<Page> {
    const hexo = await this._hexoInstanceService.getInstance()
    const docs = hexo.locals.get("pages").toArray().map(toPage)
    const doc = docs.find((item) => item.source === source)
    if (!doc || isAsset(doc)) throw new PostOrPageNotFoundError("page")
    const res = transformPage(doc)
    this._logService.log("get page by source", source)
    return res
  }
  async listCategory(): Promise<Category[]> {
    const hexo = await this._hexoInstanceService.getInstance()
    const docs = hexo.locals.get("categories").toArray().map(toCategory)
    const res = docs.map((categoryDoc) => ({
      ...categoryDoc,
      posts: categoryDoc.posts.map((p) => p.slug),
    }))
    this._logService.log("list category", res.length)
    return res
  }
  async listTag(): Promise<Tag[]> {
    const hexo = await this._hexoInstanceService.getInstance()
    const docs = hexo.locals.get("tags").toArray().map(toTag)
    const res = docs.map((tagDoc) => ({
      ...tagDoc,
      posts: tagDoc.posts.map((p) => p.slug),
    }))
    this._logService.log("list tag", res.length)
    return res
  }
  //#endregion

  //#region IHexoCommand
  async deploy(options: IDeployOptions = {}) {
    if (scriptStore.hasScript("hexo-deploy")) {
      await this._execService
        .run(scriptStore.getScript("hexo-deploy"))
        .catch((err) => {
          this._logService.error(err)
          throw new ScriptError(
            "fail to run hexo deploy script",
            "HexoDeployScriptError"
          )
        })
      return
    }
    const { generate = false } = options
    const args: string[] = []
    if (generate) args.push("--generate")
    this.runWithoutModifiedOption(async (hexo) => {
      await hexo.call("deploy", { _: args })
      await hexo.exit()
    })
    this._logService.log(`run hexo deploy with args:`, args.join(" "))
  }

  async generate(options: IGenerateOptions = {}) {
    if (scriptStore.hasScript("hexo-generate")) {
      await this._execService
        .run(scriptStore.getScript("hexo-generate"))
        .catch((err) => {
          this._logService.error(err)
          throw new ScriptError(
            "fail to run hexo generate script",
            "HexoGenerateScriptError"
          )
        })
      return
    }
    const {
      deploy = false,
      watch = false,
      bail = false,
      force = false,
      concurrency = false,
    } = options
    const args: string[] = []
    if (deploy) args.push("--deploy")
    if (watch) args.push("--watch")
    if (bail) args.push("--bail")
    if (force) args.push("--force")
    this.runWithoutModifiedOption(async (hexo) => {
      if (concurrency) args.push("--concurrency")
      await hexo.call("generate", { _: args })
      await hexo.exit()
    })
    this._logService.log(`run hexo generate with args:`, args.join(" "))
  }

  async clean() {
    if (scriptStore.hasScript("hexo-clean")) {
      await this._execService
        .run(scriptStore.getScript("hexo-clean"))
        .catch((err) => {
          this._logService.error(err)
          throw new ScriptError(
            "fail to run hexo clean script",
            "HexoCleanScriptError"
          )
        })
      return
    }
    this.runWithoutModifiedOption(async (hexo) => {
      await hexo.call("clean")
      await hexo.exit()
    })
    this._logService.log("run hexo clean")
  }
  //#endregion

  //#region IHexoCli
  async publish(filename: string, layout?: string) {
    const args: string[] = ["publish"]
    if (layout) args.push(layout)
    args.push(filename)
    const info = await this._hexoInstanceService.runBetweenReload(
      async () =>
        await run("hexo", args, {
          cwd: await this._hexoInstanceService.getBaseDir(),
          stripAnsi: true,
        })
    )
    const fullSource = expandHomeDir(info.split("Published: ")[1].trim())
    const article = (await this.getPostByFullSource(fullSource))!
    const res = await this.WithCategoriesTagsBriefArticleList(article)
    this._logService.log(`publish ${filename} with layout: ${layout}`)
    return res
  }

  async create(title: string, options: ICreateOptions = {}) {
    const args: string[] = ["new"]
    if (options.layout) args.push(options.layout)
    if (options.path) {
      const base = await this._hexoInstanceService.getBaseDir()
      const fullPath = path.resolve(base, options.path)
      const relative = path.relative(fullPath, base)
      if (!relative.startsWith("..")) {
        this._logService.error(`${fullPath} is not valid`)
        throw new InvalidOptionsError(
          `${options.path} is not inside hexo blog folder`,
          "InvalidCreatePathError"
        )
      }
      args.push("--path")
      args.push(options.path)
    }
    if (options.replace) args.push("--replace")
    if (options.slug) {
      args.push("--slug")
      args.push(options.slug)
    }
    if (title) args.push(title)
    const info = await this._hexoInstanceService.runBetweenReload(async () => {
      return await run("hexo", args, {
        cwd: await this._hexoInstanceService.getBaseDir(),
        stripAnsi: true,
      })
    })
    const fullSource = expandHomeDir(info.split("Created: ")[1].trim())
    const article = (await this.getPostOrPageByFullSource(fullSource))!
    const res = this.WithCategoriesTagsBriefArticleList(article)
    this._logService.log("create succeed", fullSource)
    return res
  }

  async update(
    source: string,
    raw: string,
    type: "post"
  ): Promise<WithCategoriesTagsBriefArticleList<Post>>
  async update(
    source: string,
    raw: string,
    type: "page"
  ): Promise<WithCategoriesTagsBriefArticleList<Page>>
  async update(source: string, raw: string, type: "post" | "page") {
    const fullPath = await this.getFullPathBySource(source, type)
    if (!fullPath) throw new PostOrPageNotFoundError(type)
    this._hexoInstanceService.runBetweenReload(() => {
      this.writeFile(fullPath, raw)
    })
    const article = (await this.getPostBySource(source))!
    return this.WithCategoriesTagsBriefArticleList(article)
  }

  async delete(
    source: string,
    type: "post" | "page"
  ): Promise<WithCategoriesTagsBriefArticleList<void>> {
    const fullPath = await this.getFullPathBySource(source, type)
    if (!fullPath) throw new PostOrPageNotFoundError(type)
    await this._hexoInstanceService.runBetweenReload(async () => {
      await this.deleteFile(fullPath)
    })
    return this.WithCategoriesTagsBriefArticleList(undefined)
  }
  //#endregion
}
