import { Logger } from 'src/utils/logger'
import Vue from 'vue'
const logger = new Logger({ prefix: 'async load' })
const state = {}

/**
 * 懒加载模块，记录加载状态
 * @param {Function} fn `()=>import('xxx)`
 * @param {String} name 随便指定一个名称，需要唯一
 * @param {Object} meta 附加数据，仅用于描述，不影响懒加载
 * @param {Number} delay 延时
 */
function load(fn, name, meta = {}, delay = 200) {
  if (!name) throw new Error('name is required')
  if (Object.keys(state).includes(name)) throw new Error('duplicate async load name:', name)
  logger.log('registed:', name)
  Vue.set(state, name, {
    loading: false,
    error: false,
    meta
  })
  return () => {
    const token = window.setTimeout(() => {
      state[name].loading = true
      logger.log('start loading:', name)
    }, delay)
    const done = v => {
      if (token) window.clearTimeout(token)
      state[name].loading = false
      logger.log('end loading:', name)
      return v
    }
    return fn().then(done, done).catch(e => {
      state[name].error = true
      logger.log('fail loading:', name)
      return e
    })
  }
}

export default {
  state, load
}
