declare module "koa-onerror" {
  import Koa from "koa"
  export interface Options {
    all(err: unknown): void
  }
  export default function (app: Koa, options?: Options): void
}
