/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "hexo-front-matter" {
  interface IOptions {
    mode?: "json" | "yaml";
    seprator?: string;
    prefixSeparator?: boolean;
  }
  interface IParseResult {
    _content: string;
    [key: string]: any;
  }
  interface ISplitResult {
    data?: string;
    content: string;
    separator?: string;
    prefixSeparator?: boolean;
  }
  /**
   * Parses front-matter.
   */
  function parse(str: string, options?: IOptions): IParseResult;
  /**
   * Converts an object to a front-matter string.
   */
  function stringify(object: any, options?: IOptions): string;
  /**
   * Splits a YAML front-matter string.
   */
  function split(str: string): ISplitResult;
  /**
   * Converts hard tabs to soft tabs.
   */
  function escape(str: string): string;
}
