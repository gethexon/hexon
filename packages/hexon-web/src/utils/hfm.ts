import hfm from "hexo-front-matter"

export const parseHfm = (str: string = "") => {
  const data = hfm.parse(str)
  const _content = data._content
  const title = data.title
  const tags = data.tags
  return { _content, title, tags }
}
