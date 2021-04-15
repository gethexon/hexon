const Hexo = require('hexo')
const hfm = require('hexo-front-matter')
const { throttle } = require('lodash')
const LTT = require('list-to-tree')
const { restrictedKeys } = require('./util')
const DI = require('../../util/di')
const { IConfigService } = require('../../base/configService')
const HexoConfig = require('./config')
const { ILogService } = require('../../base/logService')
/**
   * Transform categories to string[][]
   * @param {string | string[] | string[][]} categories
   * @returns {string[][]}
   */
function postCategoriesRaw2Array2d (categories) {
  if (!categories) return [[]]
  if (!Array.isArray(categories)) return [[categories]]
  else {
    if (!categories.filter((cat) => Array.isArray(cat)).length) {
      return [categories]
    }
    return categories.map((cat) => {
      return Array.isArray(cat) ? cat : [cat]
    })
  }
}
function postDocument2Object (doc) {
  if (doc.next)doc.next = doc.next._id
  if (doc.prev)doc.prev = doc.prev._id
  if (doc.date)doc.date = doc.date.valueOf()
  if (doc.updated)doc.updated = doc.updated.valueOf()
  const obj = doc.toObject()
  obj.tags = obj.tags.data.map(t => t._id)
  obj.categories = obj.categories.data.map(t => {
    return {
      _id: t._id,
      parent: t.parent
    }
  })

  function expand (category) {
    if (!category._child) return [category]
    return [category].concat(expand(category._child[0]))
  }
  const list = Object.keys(obj.categories).map(key => obj.categories[key]).map(obj => {
    if (obj.parent === undefined) obj.parent = 0
    return obj
  })
  const ltt = new LTT(list, {
    key_id: '_id',
    key_parent: 'parent',
    key_child: '_child'
  })
  const tree = ltt.GetTree()
  obj.categories = (tree ? tree.map(expand) : [[]]).map(ca => ca.map(c => c._id))
  obj.fm = {}
  obj.fm.fm = hfm.parse(obj.raw)
  restrictedKeys.map(key => {
    if (obj.fm.fm[key] !== undefined) {
      obj.fm[key] = obj.fm.fm[key]
      delete obj.fm.fm[key]
    }
  })
  if (obj.fm.categories)obj.fm.categories = postCategoriesRaw2Array2d(obj.fm.categories)
  return obj
}
function pageDocument2Object (doc) {
  if (doc.date)doc.date = doc.date.valueOf()
  if (doc.updated)doc.updated = doc.updated.valueOf()
  const obj = doc.toObject()
  obj.fm = hfm.parse(obj.raw)
  return obj
}
function tagDocument2Object (doc) {
  const obj = doc.toObject()
  obj.posts = obj.posts.map(p => p._id)
  return obj
}
function categoryDocument2Object (doc) {
  const obj = doc.toObject()
  obj.posts = obj.posts.map(p => p._id)
  return obj
}
class HexoAPI {
  /**
   * 有关hexo的api操作封装
   */
  constructor () {
    this._configService = DI.inject(IConfigService)
    this.HEXO_ROOT = this._configService.get(HexoConfig.HEXO_ROOT)
    this._logger = DI.inject(ILogService).get('hexo')
    this.hexo = new Hexo(this.HEXO_ROOT, {
      debug: false,
      draft: true,
      silent: process.env.NODE_ENV !== 'development'
    })
    /**
     * 每五秒执行一次，执行后五秒内触发不再执行
     */
    this.reload = throttle(this.reload, 5000, { trailing: false })
  }

  async freload () {
    await this.hexo.locals.invalidate()
    await this.hexo.load()
    this._logger.info('Force reload')
  }

  async reload () {
    await this.hexo.locals.invalidate()
    await this.hexo.load()
    this._logger.info('Reload')
  }

  async init () {
    await this.hexo.init()
  }

  async listPost () {
    await this.reload()
    const res = await this.hexo.locals.get('posts').toArray().map(postDocument2Object)
    this._logger.info('List posts', res.length)
    return res
  }

  async listPage () {
    await this.reload()
    const res = await this.hexo.locals.get('pages').toArray().map(pageDocument2Object)
    this._logger.info('List pages', res.length)
    return res
  }

  async listTag () {
    await this.reload()
    const res = await this.hexo.locals.get('tags').toArray().map(tagDocument2Object)
    this._logger.info('List tags', res.length)
    return res
  }

  async listCategory () {
    await this.reload()
    const res = await this.hexo.locals.get('categories').toArray().map(categoryDocument2Object)
    this._logger.info('List categories', res.length)
    return res
  }

  async stringify (raw, obj) {
    let str = ''
    str += hfm.split(raw).separator
    str += '\n'
    str += hfm.stringify(obj)
    return str
  }
}
const IHexoAPI = 'IHexoAPI'
DI.provide(IHexoAPI, HexoAPI)
exports.IHexoAPI = IHexoAPI
