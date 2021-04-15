require('./config')
const fs = require('hexo-fs')
const path = require('path')
const chalk = require('chalk')
const { restrictedKeys } = require('./util')
const DI = require('../../util/di')
const { IHexoAPI } = require('./hexo_api')
const { IHexoCLI } = require('./hexo_cli')
const { IConfigService } = require('../../base/configService')
const HexoConfig = require('./config')
const { ILogService } = require('../../base/logService')

class Hexo {
  constructor () {
    this._configService = DI.inject(IConfigService)
  }

  _checkReady () {
    if (!this.ready) throw new Error('Hexo initiating')
  }

  /**
   * 检测是否是hexo博客目录
   * 如果没有依赖hexo或者没有`_config.yml`则视为不是博客目录
   * 可能的错误：HexoError.NOT_BLOG_ROOT | other
   * @private
   */
  checkIsBlog (cwd) {
    let file
    try {
      // 检查是否有对应文件
      file = fs.readFileSync(path.join(cwd, 'package.json'))
      fs.readFileSync(path.join(cwd, '_config.yml'))
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error('Not blog')
      }
      throw err
    }
    // 检查是否有hexo依赖
    const packageJSON = JSON.parse(file)
    if (!packageJSON.dependencies.hexo) throw new Error('Not blog')
  }

  async init () {
    // TOD： 验证是不是hexo目录
    this.cwd = this._configService.get(HexoConfig.HEXO_ROOT)
    this.checkIsBlog(this.cwd)
    this.hapi = DI.inject(IHexoAPI)
    await this.hapi.init()
    this.hcli = DI.inject(IHexoCLI)
    this._logger = DI.inject(ILogService).get('hexo')
    this.ready = true
  }

  async listPost () {
    this._checkReady()
    return this.hapi.listPost()
  }

  async listPage () {
    this._checkReady()
    return this.hapi.listPage()
  }

  async listTag () {
    this._checkReady()
    return this.hapi.listTag()
  }

  async listCategory () {
    this._checkReady()
    return this.hapi.listCategory()
  }

  /**
   * hexo new
   * https://hexo.io/zh-cn/docs/commands.html#new
   * @param {String} title 文章名
   * @param {Object} opt 选项
   * @param {String} opt.layout 布局
   * @param {String} opt.path 路径
   * @param {String} opt.slug
   * @param {Boolean} opt.replace 是否替换已存在文件
   */
  async new (title, opt = { layout: undefined, path: undefined, slug: undefined, replace: false }) {
    this._checkReady()
    const source = await this.hcli.new(...arguments)
    return this._getBySource(source)
  }

  async _getBySource (source) {
    await this.hapi.freload()
    const post = (await this.listPost()).concat(await this.listPage()).filter(p => p.full_source === source)
    if (post.length < 1) {
      this._logger.log('new id not found')
      throw new Error('Not found')
    }
    if (post.length > 1) throw new Error('Duplicate fail found, retry later')
    return post[0]
  }

  /**
   * 从id获取文件路径
   * @param {String} id 文章id
   * @param {Boolean} page 是否是页面
   */
  async _getSource (id, page = false) {
    const res = (page ? (await this.hapi.listPage()) : (await this.hapi.listPost())).filter(r => r._id === id)
    if (res.length < 1) {
      throw new Error('Not found')
    }
    return res[0].full_source
  }

  /**
   * 从id获取原数据
   * @param {String} id 文章id
   * @param {Boolean} page 是否是页面
   */
  async _getRaw (id, page = false) {
    const res = (page ? (await this.hapi.listPage()) : (await this.hapi.listPost())).filter(r => r._id === id)
    if (res.length < 1) {
      throw new Error('Not found')
    }
    return res[0].raw
  }

  async write (id, obj, page = false) {
    this._checkReady()
    const article = JSON.parse(JSON.stringify(obj))
    if (article.fm && typeof article.fm === 'object') {
      Object.keys(article.fm).forEach(key => {
        if (key !== 'fm' && !restrictedKeys.includes(key))article[key] = article.fm[key]
      })
      if (article.fm.fm !== undefined)article.fm = article.fm.fm
      else delete article.fm
    }
    Object.keys(article).forEach(key => { if (article[key] === undefined || article[key] === '') delete article[key] })
    const string = await this.hapi.stringify(await this._getRaw(id, page), article)
    const source = await this._getSource(id, page)
    fs.writeFileSync(source, string)
    this._logger.info('Write file', chalk.magenta(source))
    await this.hapi.freload()
    return (page ? (await this.listPage()) : (await this.listPost())).filter(p => p._id === id)[0]
  }

  /**
   * 根据id删除文章
   * @param {String} id 需要删除的文章id
   * @param {Boolean} page 是否是页面
   */
  async delete (id, page = false) {
    this._checkReady()
    const source = await this._getSource(id, page)
    fs.unlinkSync(source)
    await this.hapi.freload()
    this._logger.info('Delete file', chalk.magenta(source))
  }

  /**
   * hexo generate
   * https://hexo.io/zh-cn/docs/commands.html#generate
   */
  async generate (opt = { deploy: false, watch: false, bail: false, force: false, concurrency: false }) {
    this._checkReady()
    return this.hcli.generate(...arguments)
  }

  /**
   * hexo deploy
   * https://hexo.io/zh-cn/docs/commands.html#deploy
   */
  async deploy (opt = { generate: false }) {
    this._checkReady()
    return this.hcli.deploy(...arguments)
  }

  /**
   * hexo clean
   * https://hexo.io/zh-cn/docs/commands.html#clean
   */
  async clean () {
    this._checkReady()
    return this.hcli.clean(...arguments)
  }

  /**
   * hexo publish
   * https://hexo.io/zh-cn/docs/commands.html#publish
   * @param {String} filename 文件名
   * @param {String} layout 布局
   */
  async publish (id, layout = 'post') {
    this._checkReady()
    const posts = (await this.listPost()).filter(p => p._id === id)
    if (posts.length < 1) {
      this._logger.log('publish id not found')
      throw new Error('Not found')
    }
    const post = posts[0]
    if (post.published) throw new Error('Already published')
    const filename = path.basename(post.source, path.extname(post.source))
    const source = await this.hcli.publish(filename, layout)
    return this._getBySource(source)
  }

  async gitSync () {
    return this.hcli.gitSync()
  }

  async gitSave () {
    return this.hcli.gitSave()
  }
}
const IHexo = 'IHexo'
DI.provide(IHexo, Hexo)
exports.IHexo = IHexo
