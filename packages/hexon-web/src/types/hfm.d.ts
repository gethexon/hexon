declare module "hexo-front-matter" {
  import { LoadOptions } from "js-yaml"
  interface IParseResult {
    _content: string
    [key: string]: unknown
  }
  interface IStringifyOptions {
    mode?: "json" | "yaml"
    separator: string
    prefixSeparator: boolean
  }

  export function parse(str: string, options: LoadOptions): IParseResult
  export function stringify(obj: any, options?: IStringifyOptions): string
}
