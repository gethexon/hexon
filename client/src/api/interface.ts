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
import { IYamlConfigResponse } from "@shared/types/api"

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
  getThemeConfig(): Promise<IYamlConfigResponse>
  setThemeConfig(raw: string): Promise<IYamlConfigResponse>
  getHexoConfig(): Promise<IYamlConfigResponse>
  setHexoConfig(raw: string): Promise<IYamlConfigResponse>
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
    raw: string,
    assets?: IImageAsset[]
  ): Promise<IPostWithAllData>
  saveArticle(
    type: "page",
    source: string,
    raw: string,
    assets?: IImageAsset[]
  ): Promise<IPageWithAllData>
  saveArticle(
    type: "post" | "page",
    source: string,
    raw: string,
    assets?: IImageAsset[]
  ): Promise<IPostWithAllData | IPageWithAllData>
  uploadImage(
    type: "post" | "page",
    source: string,
    file: File
  ): Promise<IImageAsset>
  deleteArticle(type: "post", source: string): Promise<IWithAllData>
  deleteArticle(type: "page", source: string): Promise<IWithAllData>
  deleteArticle(type: "post" | "page", source: string): Promise<IWithAllData>
  createArticle(
    title: string,
    options?: ICreateOptions
  ): Promise<IPostWithAllData | IPageWithAllData>
  publishArticle(source: string): Promise<Post>
  restoreArticle(source: string): Promise<Post>
  deploy(options?: IDeployOptions): Promise<void>
  generate(options?: IGenerateOptions): Promise<void>
  preview(): Promise<string>
  clean(): Promise<void>
  gitSync(): Promise<void>
  gitSave(): Promise<void>
}
