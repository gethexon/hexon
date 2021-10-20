export interface BriefArticle {
  _id: string;
  title: string;
  date: string;
  updated?: string | undefined;
  comments: boolean;
  layout: string;
  excerpt?: string | undefined;
  source: string;
  full_source: string;
  path: string;
  permalink: string;
  prev?: string | undefined; // _id
  next?: string | undefined; // _id
  photos?: string[] | undefined;
  link?: string | undefined;
  [key: string]: any;
}

export interface BriefPage extends BriefArticle {
  __page: boolean;
}

export interface BriefPost extends BriefArticle {
  published?: boolean | undefined;
  categories?: string[] | undefined;
  tags: string[];
  __post: boolean;
}

export interface Article extends BriefArticle {
  _content: string;
  content: string;
  raw?: string | undefined;
  more?: string | undefined;
}

export interface Page extends Article {
  __page: boolean;
}

export interface Post extends Article {
  published?: boolean | undefined;
  categories?: string[] | undefined;
  tags: string[];
  __post: boolean;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  path: string;
  permalink: string;
  posts: string[]; // _id
  length: number;
}
export interface Category extends Tag {
  parent: string;
}
