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

export interface ICreateOptions {
  layout?: string
  path?: string
  slug?: string
  replace?: boolean
}
export interface IDeployOptions {
  generate?: boolean
}
export interface IGenerateOptions {
  deploy?: boolean
  watch?: boolean
  bail?: boolean
  force?: boolean
  concurrency?: boolean
}
export interface IApiProvider {
  getAllData(): Promise<IWithAllData>
  getPosts(): Promise<BriefPost[]>
  getPages(): Promise<BriefPage[]>
  getTags(): Promise<Tag[]>
  getCategories(): Promise<Category[]>
  getArticle(type: "post", source: string): Promise<Post>
  getArticle(type: "page", source: string): Promise<Page>
  getArticle(type: "post" | "page", source: string): Promise<Post | Page>
  saveArticle(
    type: "post",
    source: string,
    raw: string
  ): Promise<IPostWithAllData>
  saveArticle(
    type: "page",
    source: string,
    raw: string
  ): Promise<IPageWithAllData>
  saveArticle(
    type: "post" | "page",
    source: string,
    raw: string
  ): Promise<IPostWithAllData | IPageWithAllData>
  deleteArticle(type: "post", source: string): Promise<IWithAllData>
  deleteArticle(type: "page", source: string): Promise<IWithAllData>
  deleteArticle(type: "post" | "page", source: string): Promise<IWithAllData>
  createArticle(
    title: string,
    options?: ICreateOptions
  ): Promise<IPostWithAllData | IPageWithAllData>
  publishArticle(source: string): Promise<Post>
  deploy(options?: IDeployOptions): Promise<void>
  generate(options?: IGenerateOptions): Promise<void>
  clean(): Promise<void>
  gitSync(): Promise<void>
  gitSave(): Promise<void>
}
