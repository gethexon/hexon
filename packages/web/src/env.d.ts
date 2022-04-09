/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

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

  export function parse(str: string, options?: LoadOptions): IParseResult
  export function stringify(obj: any, options?: IStringifyOptions): string
}
