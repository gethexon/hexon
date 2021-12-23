import {
  IWithAllData,
  BriefPost,
  BriefPage,
  Tag,
  Category,
  Post,
  Page,
  IPostWithAllData,
  IPageWithAllData,
} from "./entities"

export interface IApiProvider {
  getAllData(): Promise<IWithAllData>
  getPosts(): Promise<BriefPost[]>
  getPages(): Promise<BriefPage[]>
  getTags(): Promise<Tag[]>
  getCategories(): Promise<Category[]>
  getArticle(type: "post", source: string): Promise<Post>
  getArticle(type: "page", source: string): Promise<Page>
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
}
