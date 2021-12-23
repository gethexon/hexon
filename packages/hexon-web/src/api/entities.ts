import { z } from "zod"

export const ZIArticle = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  source: z.string(),
})
export type IArticle = z.infer<typeof ZIArticle>

export const ZIBrief = z.object({
  brief: z.string(),
})
export type IBrief = z.infer<typeof ZIBrief>

export const ZIPage = z.object({
  __page: z.boolean().refine((v) => v, { message: "__page must be true" }),
  __post: z.undefined(),
})
export type IPage = z.infer<typeof ZIPage>

export const ZIPost = z.object({
  slug: z.string(),
  published: z.boolean(),
  categories: z.string().array(),
  tags: z.string().array(),
  __post: z.boolean().refine((v) => v, { message: "__post must be true" }),
  __page: z.undefined(),
})
export type IPost = z.infer<typeof ZIPost>

export const ZIDetail = z.object({
  _content: z.string(),
  content: z.string(),
  raw: z.string().optional(),
})
export type IDetail = z.infer<typeof ZIDetail>

export const ZBriefPage = z
  .object({})
  .merge(ZIArticle)
  .merge(ZIBrief)
  .merge(ZIPage)
export type BriefPage = z.infer<typeof ZBriefPage>

export const ZBriefPost = z
  .object({})
  .merge(ZIArticle)
  .merge(ZIBrief)
  .merge(ZIPost)
export type BriefPost = z.infer<typeof ZBriefPost>

export const ZPage = z.object({}).merge(ZIArticle).merge(ZIPost).merge(ZIDetail)
export type Page = z.infer<typeof ZPage>

export const ZPost = z.object({}).merge(ZIArticle).merge(ZIPost).merge(ZIDetail)
export type Post = z.infer<typeof ZPost>

export const ZTag = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  posts: z.string().array(),
})
export type Tag = z.infer<typeof ZTag>

export const ZCategory = ZTag.extend({
  parent: z.string().optional(),
})
export type Category = z.infer<typeof ZCategory>

export const ZIWithAllData = z.object({
  posts: ZBriefPost.array(),
  pages: ZBriefPage.array(),
  categories: ZCategory.array(),
  tags: ZTag.array(),
})
export type IWithAllData = z.infer<typeof ZIWithAllData>

export const ZIPageWithAllData = ZIWithAllData.extend({ page: ZPage })
export type IPageWithAllData = z.infer<typeof ZIPageWithAllData>

export const ZIPostWithAllData = ZIWithAllData.extend({ post: ZPost })
export type IPostWithAllData = z.infer<typeof ZIPostWithAllData>
