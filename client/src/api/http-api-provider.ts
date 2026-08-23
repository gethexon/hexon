import { isPost } from "~/utils/article"
import {
  ICreateOptions,
  ZBriefPage,
  ZBriefPost,
  ZCategory,
  ZIPageWithAllData,
  ZImageAsset,
  ZIPostWithAllData,
  ZIWithAllData,
  ZPage,
  ZPost,
  ZTag,
} from "."
import {
  BriefPage,
  BriefPost,
  Category,
  IPageWithAllData,
  IImageAsset,
  IPostWithAllData,
  IWithAllData,
  Page,
  Post,
  Tag,
} from "./entities"
import { IApiProvider, IDeployOptions, IGenerateOptions } from "./interface"
import { request } from "./instance"

const dashIdToId = ({ _id: id, ...rest }: any) => ({ id, ...rest })

async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ""
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return window.btoa(binary)
}

export class HttpApiProvider implements IApiProvider {
  async getAllData(): Promise<IWithAllData> {
    const [posts, pages, tags, categories] = await Promise.all([
      this.getPosts(),
      this.getPages(),
      this.getTags(),
      this.getCategories(),
    ])
    return { posts, pages, tags, categories }
  }

  async getPosts(): Promise<BriefPost[]> {
    const res = await request.get<BriefPost[]>("/hexo/posts")
    const data: BriefPost[] = ZBriefPost.array().parse(res.data.map(dashIdToId))
    return data
  }

  async getPages(): Promise<BriefPage[]> {
    const res = await request.get<BriefPage[]>("/hexo/pages")
    const data: BriefPage[] = ZBriefPage.array().parse(res.data.map(dashIdToId))
    return data
  }

  async getTags(): Promise<Tag[]> {
    const res = await request.get("/hexo/tags")
    const data: Tag[] = ZTag.array().parse(res.data.map(dashIdToId))
    return data
  }

  async getCategories(): Promise<Category[]> {
    const res = await request.get<Category[]>("/hexo/categories")
    const data: Category[] = ZCategory.array().parse(res.data.map(dashIdToId))
    return data
  }

  async getArticle(type: "post", source: string): Promise<Post>
  async getArticle(type: "page", source: string): Promise<Page>
  async getArticle(type: "post" | "page", source: string): Promise<Post | Page>
  async getArticle(
    type: "post" | "page",
    source: string
  ): Promise<Post | Page> {
    const res = await request.get(`/hexo/${type}/${encodeURIComponent(source)}`)
    if (type === "post") {
      const data: Post = ZPost.parse(dashIdToId(res.data))
      return data
    } else {
      const data: Page = ZPage.parse(dashIdToId(res.data))
      return data
    }
  }

  async saveArticle(
    type: "post",
    source: string,
    raw: string,
    assets?: IImageAsset[]
  ): Promise<IPostWithAllData>
  async saveArticle(
    type: "page",
    source: string,
    raw: string,
    assets?: IImageAsset[]
  ): Promise<IPageWithAllData>
  async saveArticle(
    type: "post" | "page",
    source: string,
    raw: string,
    assets?: IImageAsset[]
  ): Promise<IPostWithAllData | IPageWithAllData>
  async saveArticle(
    type: "post" | "page",
    source: string,
    raw: string,
    assets: IImageAsset[] = []
  ): Promise<IPostWithAllData | IPageWithAllData> {
    const res = await request.put(
      `/hexo/${type}/${encodeURIComponent(source)}`,
      { raw, assets }
    )
    if (type === "post") {
      const { article: post, posts, pages, tags, categories } = res.data
      const data: IPostWithAllData = ZIPostWithAllData.parse({
        post: dashIdToId(post),
        posts: posts.map(dashIdToId),
        pages: pages.map(dashIdToId),
        tags: tags.map(dashIdToId),
        categories: categories.map(dashIdToId),
      })
      return data
    } else {
      const { article: page, posts, pages, tags, categories } = res.data
      const data: IPageWithAllData = ZIPageWithAllData.parse({
        page: dashIdToId(page),
        posts: posts.map(dashIdToId),
        pages: pages.map(dashIdToId),
        tags: tags.map(dashIdToId),
        categories: categories.map(dashIdToId),
      })
      return data
    }
  }

  async uploadImage(
    type: "post" | "page",
    source: string,
    file: File
  ): Promise<IImageAsset> {
    const res = await request.post("/hexo/assets/upload", {
      type,
      source,
      name: file.name,
      mime: file.type,
      data: await fileToBase64(file),
    })
    return ZImageAsset.parse(res.data)
  }
  async deleteArticle(type: "post", source: string): Promise<IWithAllData>
  async deleteArticle(type: "page", source: string): Promise<IWithAllData>
  async deleteArticle(
    type: "post" | "page",
    source: string
  ): Promise<IWithAllData>
  async deleteArticle(
    type: "post" | "page",
    source: string
  ): Promise<IWithAllData> {
    const res = await request.delete(
      `/hexo/${type}/${encodeURIComponent(source)}`
    )
    const { posts, pages, tags, categories } = res.data
    const data = ZIWithAllData.parse({
      posts: posts.map(dashIdToId),
      pages: pages.map(dashIdToId),
      tags: tags.map(dashIdToId),
      categories: categories.map(dashIdToId),
    })
    return data
  }

  async createArticle(
    title: string,
    options: ICreateOptions = {}
  ): Promise<IPostWithAllData | IPageWithAllData> {
    const res = await request.post("/hexo/create", { title, ...options })
    const { article } = res.data
    if (isPost(article)) {
      const { article: post, posts, pages, tags, categories } = res.data
      const data: IPostWithAllData = ZIPostWithAllData.parse({
        post: dashIdToId(post),
        posts: posts.map(dashIdToId),
        pages: pages.map(dashIdToId),
        tags: tags.map(dashIdToId),
        categories: categories.map(dashIdToId),
      })
      return data
    } else {
      const { article: page, posts, pages, tags, categories } = res.data
      const data: IPageWithAllData = ZIPageWithAllData.parse({
        page: dashIdToId(page),
        posts: posts.map(dashIdToId),
        pages: pages.map(dashIdToId),
        tags: tags.map(dashIdToId),
        categories: categories.map(dashIdToId),
      })
      return data
    }
  }
  async publishArticle(filename: string, layout?: string): Promise<Post> {
    const res = await request.post("/hexo/publish", {
      filename,
      layout,
    })
    const { article } = res.data
    return ZPost.parse(dashIdToId(article))
  }
  async restoreArticle(source: string): Promise<Post> {
    const res = await request.post("/hexo/restore", { source })
    const { article } = res.data
    return ZPost.parse(dashIdToId(article))
  }
  async deploy(options: IDeployOptions = {}): Promise<void> {
    return request.post("/hexo/deploy", options)
  }
  async generate(options: IGenerateOptions = {}): Promise<void> {
    return request.post("/hexo/generate", options)
  }
  async preview(): Promise<string> {
    const res = await request.get<{ url: string }>("/hexo/preview")
    return res.data.url
  }
  async clean(): Promise<void> {
    return request.post("/hexo/clean")
  }
  async gitSync(): Promise<void> {
    return request.post("/git/sync")
  }
  async gitSave(): Promise<void> {
    return request.post("/git/save")
  }
}
