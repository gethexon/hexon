interface IArticle {
  _id: string
  title: string
  date: string
  updated?: string | undefined
  comments: boolean
  layout: string
  excerpt?: string | undefined
  source: string
  full_source: string
  path: string
  permalink: string
  prev?: string | undefined // _id
  next?: string | undefined // _id
  photos?: string[] | undefined
  link?: string | undefined
  [key: string]: any
}
interface IBrief {
  brief: string
}
interface IPage {
  brief: string
}
interface IPost {
  slug: string
  published?: boolean | undefined
  categories?: string[] | undefined
  tags: string[]
  __post: boolean
}
interface IDetail {
  _content: string
  content: string
  raw?: string | undefined
  more?: string | undefined
}

export interface BriefPage extends IArticle, IBrief, IPage {}

export interface BriefPost extends IArticle, IBrief, IPost {}

export interface Page extends IArticle, IBrief, IPage, IDetail {}

export interface Post extends IArticle, IBrief, IPost, IDetail {}

export interface Tag {
  _id: string
  name: string
  slug: string
  path: string
  permalink: string
  posts: string[] // _id
  length: number
}
export interface Category extends Tag {
  parent: string
}

export interface Say {
  date: string
  content?: string | null
  link?: string
  video?: { bilibili?: string, player?: string }
  aplayer?: { server: string, id: number }
  image?: string[]
}
