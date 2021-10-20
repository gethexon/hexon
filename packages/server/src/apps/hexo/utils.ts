import Hexo from "hexo";

interface Query<T> {
  data: T[];
  length: number;
}

interface Article {
  _id: string;
  title: string;
  date: number;
  updated?: number | undefined;
  comments: boolean;
  layout: string;
  content: string;
  _content: string;
  excerpt?: string | undefined;
  more?: string | undefined;
  source: string;
  full_source: string;
  path: string;
  permalink: string;
  prev?: Page | undefined;
  next?: Page | undefined;
  raw?: string | undefined;
  photos?: string[] | undefined;
  link?: string | undefined;
  [key: string]: any;
}

interface Page extends Article {
  __page: boolean;
}

interface Post extends Article {
  published?: boolean | undefined;
  categories?: Query<Category> | undefined;
  tags: Query<Tag>;
  __post: boolean;
}

interface Tag {
  _id: string;
  name: string;
  slug: string;
  path: string;
  permalink: string;
  posts: Post[];
  length: number;
}

interface Category extends Tag {
  parent: string;
}

export const toPost = (post: Hexo.Locals.Post) => post as unknown as Post;
export const toPage = (post: Hexo.Locals.Page) => post as unknown as Page;
export const toCategory = (post: Hexo.Locals.Category) =>
  post as unknown as Category;
export const toTag = (post: Hexo.Locals.Tag) => post as unknown as Tag;
