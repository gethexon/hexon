import { origin } from "./request"

export default {
  check: async () => {
    return origin.get('/install/')
  },
  install: async (opt) => {
    if (!opt.root) throw new Error('opt.root is required')
    if (!opt.secret) throw new Error('opt.secret is required')
    if (!opt.expire) throw new Error('opt.expire is required')
    if (!opt.refresh) throw new Error('opt.refresh is required')
    if (!opt.username) throw new Error('opt.username is required')
    if (!opt.password) throw new Error('opt.password is required')
    return origin.post('/install/', opt)
  },
  checkroot: async (root) => {
    if (!root) throw new Error('root is required')
    return origin.post('/install/checkroot', { root })
  }
}
