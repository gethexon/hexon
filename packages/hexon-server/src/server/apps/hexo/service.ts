import { inject, injectable, singleton } from "tsyringe"
import fs from "fs"
import HexoCore from "hexo"
import { HexoInstanceService } from "~/server/services/hexo-instance-service"
import { LogService } from "~/server/services/log-service"
import { expandHomeDir } from "~/server/utils"
import { BRIEF_LENGTH } from "~/shared/constants"
import { BriefPage, BriefPost, Category, Page, Post, Tag } from "./types"
import {
  HexoPage,
  HexoPost,
  run,
  toCategory,
  toPage,
  toPost,
  toTag,
} from "./utils"

declare module "hexo" {
  interface InstanceOptions {
    draft?: boolean
    drafts?: boolean
  }
}

interface IHexoAPI {
  listPost(): Promise<BriefPost[]>
  listPage(): Promise<BriefPage[]>
  listCategory(): Promise<Category[]>
  listTag(): Promise<Tag[]>
  getPostBySource(source: string): Promise<Post>
  getPageBySource(source: string): Promise<Page>
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
  }
}

function transformPostToBrief(doc: Post): BriefPost {
  const res = { ...doc, brief: doc._content.slice(0, BRIEF_LENGTH) }
  delete res._content
  delete doc.content
  delete doc.raw
  return res
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
  }
}

function transformPageToBrief(doc: Page): BriefPage {
  const res = { ...doc, brief: doc._content.slice(0, BRIEF_LENGTH) }
  delete res._content
  delete res.content
  delete res.raw
  return res
}

@injectable()
@singleton()
class Hexo implements IHexoAPI, IHexoCommand, IHexoCli {
  //#region init
  constructor(
    @inject(HexoInstanceService)
    private _hexoInstanceService: HexoInstanceService,
    @inject(LogService) private _logService: LogService
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
      this._logService.error(e)
      throw new Error("fail to write file")
    }
  }

  private deleteFile(fullPath: string) {
    try {
      fs.rmSync(fullPath)
    } catch (e) {
      this._logService.error("fail to delete file")
      this._logService.error(e)
      throw new Error("fail to delete file")
    }
  }

  private async getFullPathBySource(source: string, type: "post" | "page") {
    const hexo = await this._hexoInstanceService.getInstance()

    if (type === "post")
      return hexo.locals
        .get("posts")
        .toArray()
        .find((item) => item.source === source).full_source
    else
      return hexo.locals
        .get("pages")
        .toArray()
        .find((item) => item.source === source).full_source
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
  async getPostBySource(source: string): Promise<Post> {
    const hexo = await this._hexoInstanceService.getInstance()
    const docs = hexo.locals.get("posts").toArray().map(toPost)
    const doc = docs.find((item) => item.source === source)
    if (!doc) throw new Error("not found")
    return transformPost(doc)
  }
  async listPage() {
    const hexo = await this._hexoInstanceService.getInstance()
    const docs = hexo.locals.get("pages").toArray().map(toPage)
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
    if (!doc) throw new Error("not found")
    return transformPage(doc)
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
    const { generate = false } = options
    const args: string[] = []
    if (generate) args.push("--generate")
    this.runWithoutModifiedOption(async (hexo) => {
      await hexo.call("deploy", { _: args })
      await hexo.exit()
    })
    this._logService.log("deploy succeed")
  }

  async generate(options: IGenerateOptions = {}) {
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
    this._logService.log("generate succeed")
  }

  async clean() {
    this.runWithoutModifiedOption(async (hexo) => {
      await hexo.call("clean")
      await hexo.exit()
    })
    this._logService.log("clean succeed")
  }
  //#endregion

  //#region IHexoCli
  async publish(filename: string, layout?: string) {
    const args: string[] = ["publish"]
    if (layout) args.push(layout)
    args.push(filename)
    const info = await run("hexo", args, {
      cwd: await this._hexoInstanceService.getBaseDir(),
    })
    await this._hexoInstanceService.reload()
    const fullSource = expandHomeDir(info.split("Published: ")[1].trim())
    const article = await this.getPostByFullSource(fullSource)
    const res = this.WithCategoriesTagsBriefArticleList(article)
    this._logService.log("publish succeed", filename)
    return res
  }

  async create(title: string, options?: ICreateOptions) {
    const args: string[] = ["new"]
    if (options.layout) args.push(options.layout)
    if (options.path) {
      args.push("--path")
      args.push(options.path)
    }
    if (options.replace) args.push("--replace")
    if (options.slug) {
      args.push("--slug")
      args.push(options.slug)
    }
    if (title) args.push(title)
    const info = await run("hexo", args, {
      cwd: await this._hexoInstanceService.getBaseDir(),
    })
    await this._hexoInstanceService.reload()
    const fullSource = expandHomeDir(info.split("Created: ")[1].trim())
    const article = await this.getPostOrPageByFullSource(fullSource)
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
    if (!fullPath) throw new Error("not found")
    this.writeFile(fullPath, raw)
    await this._hexoInstanceService.reload()
    const article = await this.getPostBySource(source)
    const res = this.WithCategoriesTagsBriefArticleList(article)
    this._logService.log("update succeed", source)
    return res
  }

  async delete(
    source: string,
    type: "post" | "page"
  ): Promise<WithCategoriesTagsBriefArticleList<void>> {
    const fullPath = await this.getFullPathBySource(source, type)
    if (!fullPath) throw new Error("not found")
    this.deleteFile(fullPath)
    await this._hexoInstanceService.reload()
    const res = this.WithCategoriesTagsBriefArticleList(null)
    this._logService.log("delete succeed", source)
    return res
  }
  //#endregion
}

export default Hexo
