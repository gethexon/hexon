import Hexo from "hexo";
import execa from "execa";

interface Query<T> {
  data: T[];
  length: number;
}

export interface HexoArticle {
  _id: string;
  slug: string;
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
  prev?: HexoPage | undefined;
  next?: HexoPage | undefined;
  raw?: string | undefined;
  photos?: string[] | undefined;
  link?: string | undefined;
  [key: string]: any;
}

export interface HexoPage extends HexoArticle {
  __page: boolean;
}

export interface HexoPost extends HexoArticle {
  published?: boolean | undefined;
  categories?: Query<HexoCategory> | undefined;
  tags: Query<HexoTag>;
  __post: boolean;
}

export interface HexoTag {
  _id: string;
  name: string;
  slug: string;
  path: string;
  permalink: string;
  posts: HexoPost[];
  length: number;
}

export interface HexoCategory extends HexoTag {
  parent: string;
}

export const toPost = (post: Hexo.Locals.Post) => post as unknown as HexoPost;
export const toPage = (post: Hexo.Locals.Page) => post as unknown as HexoPage;
export const toCategory = (post: Hexo.Locals.Category) =>
  post as unknown as HexoCategory;
export const toTag = (post: Hexo.Locals.Tag) => post as unknown as HexoTag;

export async function run(
  command: string,
  args?: string[],
  opt?: execa.Options
) {
  return (await execa(command, args, { ...opt, stdio: "pipe" })).stdout;
}
