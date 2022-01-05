/**
 * @file 处理 frontmatter 的格式化
 *
 * invernal_raw
 * => title, _conent ... categories and more
 * => Editors
 * => update:title
 * => pasetHfm(internal_raw | raw) // set defaults
 * => { ..oldObj,...updatedObj }
 * => stringifyHfm(newObj) // remove defaults
 * => internal_raw
 */

import hfm from "hexo-front-matter"
import { categories2Array2d } from "~/utils"

type FrontMatterRequired = {
  _content: string
}

type FrontMatterPart = {
  title: string
  date: string | undefined
  updated: string | undefined
  tags: string[]
  categories: string[]
  [key: string]: unknown
}
type FrontMatterResult = FrontMatterRequired & FrontMatterPart
type FrontMatterInput = FrontMatterRequired & Partial<FrontMatterPart>

export const parseHfm = (str: string = ""): FrontMatterResult => {
  const {
    _content: d_content,
    title: dtitle,
    date: ddate,
    updated: dupdated,
    tags: dtags,
    categories: dcategories,
    ...rest
  } = hfm.parse(str)
  const parseString = (val: unknown): string => {
    return typeof val === "string" ? val : ""
  }
  const parseStringArray = (val: unknown): string[] => {
    if (!Array.isArray(val)) return []
    return val.map(parseString)
  }
  const parseStringOrArray = (val: unknown): (string | string[])[] => {
    if (!Array.isArray(val)) return []
    return val.map((v) =>
      Array.isArray(v) ? parseStringArray(v) : parseString(v)
    )
  }
  const parseStringOrUndefined = (val: unknown): string | undefined => {
    if (typeof val === "undefined") return val
    return parseString(val)
  }
  const _content = parseString(d_content)
  const title = parseString(dtitle)
  const tags = parseStringArray(dtags)
  const date = parseStringOrUndefined(ddate)
  const updated = parseStringOrUndefined(dupdated)
  const categories =
    categories2Array2d(parseStringOrArray(dcategories))[0] ?? []
  return {
    _content,
    title,
    tags,
    categories,
    date,
    updated,
    ...rest,
  }
}

export const stringifyHfm = ({
  _content: d_content,
  title: dtitle,
  tags: dtags,
  categories: dcategories,
  ...rest
}: FrontMatterInput) => {
  const _content = d_content
  const title = dtitle || undefined
  const tags = dtags?.length ? dtags : undefined
  const categories = dcategories?.length ? dcategories : undefined
  let o: FrontMatterInput = { _content, ...rest }
  title && (o = { ...o, title })
  tags && (o = { ...o, tags })
  categories && (o = { ...o, categories })
  return hfm.stringify(o)
}

export const updateStringByObj = (
  str: string,
  obj: FrontMatterInput
): string => {
  return stringifyHfm({ ...parseHfm(str), ...obj })
}
