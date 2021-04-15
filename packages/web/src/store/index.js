import Vue from 'vue'
import Vuex from 'vuex'
import common from './common'
import hexo from './hexo'
import user from './user'
import ui from './ui'
// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const Store = new Vuex.Store({
  modules: {
    common,
    hexo,
    user,
    ui
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING
})
export default Store
