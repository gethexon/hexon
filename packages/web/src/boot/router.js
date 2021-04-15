import api from 'src/api'
import services from 'src/services'
import Router from 'vue-router'
// https://github.com/vuejs/vue-router/issues/2881
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(() => { })
}
let installed = false
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    //#region install
    if (!installed) {
      store.commit('ui/showLoading', "正在初始化...")
      try {
        await api.install.check()
        store.commit('ui/hideLoading')
        if (to.path === '/install') next()
        else next('/install')
        return
      } catch (err) { installed = true }
    }
    //#endregion
    //#region init
    if (store.state.user.first) {
      store.commit('user/check')
      store.commit('ui/showLoading', "正在检查用户状态...")
      if (services.auth.hasToken()) {
        await store.dispatch('user/info')
        if (store.state.user.alive) {
          store.commit('ui/showLoading', "正在载入数据...")
          await store.dispatch("init")
        }
      }
      store.commit('ui/hideLoading')
    }
    //#endregion
    if (store.state.user.alive) {
      if (to.path === '/login') next(from.path)
      else next()
    } else {
      if (to.path !== '/login') next('/login')
      else next()
    }
  })
}
