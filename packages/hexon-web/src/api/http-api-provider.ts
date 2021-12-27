import account from "~/account"
import {
  ZBriefPage,
  ZBriefPost,
  ZCategory,
  ZIPageWithAllData,
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
  IPostWithAllData,
  IWithAllData,
  Page,
  Post,
  Tag,
} from "./entities"
import { IApiProvider } from "./interface"

const dashIdToId = ({ _id: id, ...rest }: any) => ({ id, ...rest })

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
    const res = await account.access.get<BriefPost[]>("/hexo/posts")
    const data: BriefPost[] = ZBriefPost.array().parse(res.data.map(dashIdToId))
    return data
  }

  async getPages(): Promise<BriefPage[]> {
    const res = await account.access.get<BriefPage[]>("/hexo/pages")
    const data: BriefPage[] = ZBriefPage.array().parse(res.data.map(dashIdToId))
    return data
  }

  async getTags(): Promise<Tag[]> {
    const res = await account.access.get("/hexo/tags")
    const data: Tag[] = ZTag.array().parse(res.data.map(dashIdToId))
    return data
  }

  async getCategories(): Promise<Category[]> {
    const res = await account.access.get<Category[]>("/hexo/categories")
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
    const res = await account.access.get(
      `/hexo/${type}/${encodeURIComponent(source)}`
    )
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
    raw: string
  ): Promise<IPostWithAllData>
  async saveArticle(
    type: "page",
    source: string,
    raw: string
  ): Promise<IPageWithAllData>
  async saveArticle(
    type: "post" | "page",
    source: string,
    raw: string
  ): Promise<IPostWithAllData | IPageWithAllData>
  async saveArticle(
    type: "post" | "page",
    source: string,
    raw: string
  ): Promise<IPostWithAllData | IPageWithAllData> {
    const res = await account.access.put(
      `/hexo/${type}/${encodeURIComponent(source)}`,
      { raw }
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
    const res = await account.access.delete(
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
}
