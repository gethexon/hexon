const DI = require('../util/di')
const { IHexo } = require('./core/hexo')

exports.search = async (query) => {
  const hexo = DI.inject(IHexo)
  const regexp = new RegExp(query, 'gi')
  const posts = await hexo.listPost()
  const pages = await hexo.listPage()
  const articles = posts.concat(pages).map(article => ({ _id: article._id, raw: article.raw }))
  const results = articles.map(({ _id, raw }) => {
    const matchs = [...raw.matchAll(regexp)]
    return {
      _id,
      matchs: matchs.map(match => {
        const text = match.toString()
        return {
          text,
          index: match.index,
          content: raw.slice(Math.max(match.index - 20, 0), match.index + text.length + 20).trim()
        }
      })
    }
  }).filter(result => result.matchs.length)
  return results
}
