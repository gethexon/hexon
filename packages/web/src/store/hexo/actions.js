import Vue from 'vue'
import services from "src/services"
import { Loading } from 'quasar'
import { NetworkError } from 'src/api/request'
export async function listPosts({ commit }) {
  commit('requestListPosts')
  try {
    const postsList = await services.hexo.listPosts()
    commit('successListPosts', postsList)
  } catch (err) {
    commit('failedListPosts', err)
    if (!(err instanceof NetworkError)) throw err
  }
}
export async function listPages({ commit }) {
  commit('requestListPages')
  try {
    const postsList = await services.hexo.listPages()
    commit('successListPages', postsList)
  } catch (err) {
    commit('failedListPages', err)
    if (!(err instanceof NetworkError)) throw err
  }
}
export async function listTags({ commit }) {
  commit('requestListTags')
  try {
    const postsList = await services.hexo.listTags()
    commit('successListTags', postsList)
  } catch (err) {
    commit('failedListTags', err)
    if (!(err instanceof NetworkError)) throw err
  }
}
export async function listCategories({ commit }) {
  commit('requestListCategories')
  try {
    const postsList = await services.hexo.listCategories()
    commit('successListCategories', postsList)
  } catch (err) {
    commit('failedListCategories', err)
    if (!(err instanceof NetworkError)) throw err
  }
}
export async function newPostOrPage({ commit, dispatch }, { fakeId, opt }) {
  if (opt.title === undefined) throw new Error('title is required')
  if (fakeId === undefined) throw new Error('fakeId is required')
  commit('requestNew', { fakeId, opt })
  Loading.show()
  try {
    const res = await services.hexo.newPostOrPage(opt)
    if (!res.__page) {
      commit('successNewPost', { fakeId, post: res })
      dispatch('listTags')
      dispatch('listCategories')
    } else commit('successNewPage', { fakeId, page: res })
  } catch (err) {
    commit('failedNew', { fakeId, err })
    if (!(err instanceof NetworkError)) throw err
  } finally {
    Loading.hide()
  }
}
export async function updatePostOrPage({ state, commit, dispatch }, opt = {}) {
  if (opt.id === undefined) throw new Error('id is required')
  if (opt.page === undefined) throw new Error('page(boolean) is required')

  const status = state[opt.page ? 'pages' : 'posts'].data[opt.id].status
  if (status === 'saving' || status === 'loading') return
  if (!opt.page) commit('requestUpdatePost', opt.id)
  else commit('requestUpdatePage', opt.id)
  try {
    const obj = {}
    // saved是打算保存的内容，modify用来存储保存过程中产生的更改
    if (!opt.page) {
      Object.assign(obj, state.posts.data[opt.id].data.fm)
      Object.assign(obj, state.posts.data[opt.id].saved)
    } else {
      Object.assign(obj, state.pages.data[opt.id].data.fm)
      Object.assign(obj, state.pages.data[opt.id].saved)
    }
    if (opt.obj) Object.assign(obj, opt.obj)
    if (!opt.hide) Loading.show()
    const res = await services.hexo.updatePostOrPage(opt.id, opt.page, obj)
    if (!opt.page) {
      commit('successUpdatePost', res)
      dispatch('listTags')
      dispatch('listCategories')
    } else commit('successUpdatePage', res)
    Vue.notify({
      title: '保存成功',
      type: 'success',
      duration: 1000
    })
  } catch (err) {
    if (!opt.page) commit('failedUpdatePost', { id: opt.id, err })
    else commit('failedUpdatePage', { id: opt.id, err })
    Vue.notify({
      title: '保存失败',
      type: 'error',
      text: err instanceof NetworkError ? err.message : 'unknown error',
      duration: 1000
    })
    if (!(err instanceof NetworkError)) throw err
  } finally {
    Loading.hide()
  }
}
export async function deletePostOrPage({ commit, dispatch }, opt = {}) {
  if (opt.id === undefined) throw new Error('id is required')
  if (opt.page === undefined) throw new Error('page is required')
  try {
    await services.hexo.deletePostOrPage(opt.id, opt.page)
    if (!opt.page) {
      commit('successDeletePost', opt.id)
      if (opt.onsuccess && typeof opt.onsuccess === 'function') await opt.onsuccess()
      dispatch('listTags')
      dispatch('listCategories')
    } else {
      commit('successDeletePage', opt.id)
      if (opt.onsuccess && typeof opt.onsuccess === 'function') await opt.onsuccess()
    }
    Vue.notify({
      title: '删除成功',
      text: opt.id,
      type: 'success',
      duration: 1000
    })
  } catch (err) {
    Vue.notify({
      title: '删除失败',
      type: 'error',
      text: err instanceof NetworkError ? err.message : 'unknown error',
      duration: 1000
    })
    if (!(err instanceof NetworkError)) throw err
  }
}
export async function publishPost({ commit }, { id, onsuccess }) {
  try {
    Loading.show()
    const res = await services.hexo.publishPost(id)
    Vue.notify({
      title: '发布成功',
      text: id,
      type: 'success',
      duration: 1000
    })
    // 添加新文章
    commit('successPublish1', res)
    if (onsuccess && typeof onsuccess === 'function') await onsuccess(res)
    // 删除旧文章
    commit('successPublish2', id)
  } catch (err) {
    Vue.notify({
      title: '发布失败',
      type: 'error',
      text: err instanceof NetworkError ? err.message : 'unknown error',
      duration: 1000
    })
    if (!(err instanceof NetworkError)) throw err
  } finally {
    Loading.hide()
  }
}
