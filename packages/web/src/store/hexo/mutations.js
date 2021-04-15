import Vue from 'vue'
//#region listPosts
export function requestListPosts(state) {
  state.posts.loading = true
  state.posts.err = ''
}
export function successListPosts(state, postsList) {
  state.posts.loading = false
  state.posts.data = {}
  postsList.map(post => {
    const obj = {}
    obj.loading = false
    obj.data = post
    obj.modify = {}
    obj.saved = {}
    Vue.set(state.posts.data, post._id, obj)
  })
  state.posts.err = ''
}
export function failedListPosts(state, err) {
  state.posts.loading = false
  state.posts.err = err
}
//#endregion
//#region listPages
export function requestListPages(state) {
  state.pages.loading = true
  state.pages.err = ''
}
export function successListPages(state, pagesList) {
  state.pages.loading = false
  state.pages.data = {}
  pagesList.map(page => {
    const obj = {}
    obj.loading = false
    obj.data = page
    obj.modify = {}
    obj.saved = {}
    Vue.set(state.pages.data, page._id, obj)
  })
  state.pages.err = ''
}
export function failedListPages(state, err) {
  state.pages.loading = false
  state.pages.err = err
}
//#endregion
//#region listTags
export function requestListTags(state) {
  state.tags.loading = true
  state.tags.err = ''
}
export function successListTags(state, tagsList) {
  state.tags.loading = false
  state.tags.data = {}
  tagsList.map(tag => {
    const obj = {}
    obj.loading = false
    obj.data = tag
    Vue.set(state.tags.data, tag._id, obj)
  })
  state.tags.err = ''
}
export function failedListTags(state, err) {
  state.tags.loading = false
  state.tags.err = err
}
//#endregion
//#region listCategories
export function requestListCategories(state) {
  state.categories.loading = true
  state.categories.err = ''
}
export function successListCategories(state, categoriesList) {
  state.categories.loading = false
  state.categories.data = {}
  categoriesList.map(category => {
    const obj = {}
    obj.loading = false
    obj.data = category
    Vue.set(state.categories.data, category._id, obj)
  })
  state.categories.err = ''
}
export function failedListCategories(state, err) {
  state.categories.loading = false
  state.categories.err = err
}
//#endregion
//#region new
export function requestNew(state, { fakeId, opt }) {
  Vue.set(state.creating, fakeId, {
    _id: fakeId,
    opt,
    loading: true,
    error: '',
    trueId: null,
    page: null
  })
}
export function successNew(state, { fakeId, trueId, page }) {
  state.creating[fakeId].trueId = trueId
  state.creating[fakeId].page = page
}
export function failedNew(state, { fakeId, error }) {
  state.creating[fakeId].loading = false
  state.creating[fakeId].error = error
}
export function clearFake(state, fakeId) {
  Vue.delete(state.creating, fakeId)
}
export function successNewPost(state, { fakeId, post }) {
  Vue.set(state.posts.data, post._id, {
    loading: false,
    data: post,
    modify: {},
    saved: {}
  })
  successNew(state, { fakeId, trueId: post._id, page: false })
}
export function successNewPage(state, { fakeId, page }) {
  Vue.set(state.pages.data, page._id, {
    loading: false,
    data: page,
    modify: {},
    saved: {}
  })
  successNew(state, { fakeId, trueId: page._id, page: true })
}
//#endregion
//#region update
export function localUpdatePost(state, { id, obj }) {
  Vue.set(state.posts.data[id], 'modify', obj)
}
export function requestUpdatePost(state, id) {
  state.posts.data[id].loading = true
  state.posts.data[id].err = ''
  Vue.set(state.posts.data[id], 'saved', state.posts.data[id].modify)
  Vue.set(state.posts.data[id], 'modify', {})
}
export function successUpdatePost(state, post) {
  state.posts.data[post._id].loading = false
  state.posts.data[post._id].data = post
  Vue.set(state.posts.data[post._id], 'saved', {})
  state.posts.data[post._id].err = ''
}
export function failedUpdatePost(state, { id, err }) {
  state.posts.data[id].loading = false
  state.posts.data[id].err = err
  Vue.set(state.posts.data[id], 'modify', Object.assign(state.posts.data[id].saved, state.posts.data[id].modify))
  Vue.set(state.posts.data[id], 'saved', {})
}
export function localUpdatePage(state, { id, obj }) {
  Vue.set(state.pages.data[id], 'modify', obj)
}
export function requestUpdatePage(state, id) {
  state.pages.data[id].loading = true
  state.pages.data[id].err = ''
  Vue.set(state.pages.data[id], 'saved', state.pages.data[id].modify)
  Vue.set(state.pages.data[id], 'modify', {})
}
export function successUpdatePage(state, page) {
  state.pages.data[page._id].loading = false
  state.pages.data[page._id].data = page
  Vue.set(state.pages.data[page._id], 'saved', {})
  state.pages.data[page._id].err = ''
}
export function failedUpdatePage(state, { id, err }) {
  state.pages.data[id].loading = false
  state.pages.data[id].err = err
  Vue.set(state.pages.data[id], 'modify', Object.assign(state.pages.data[id].saved, state.pages.data[id].modify))
  Vue.set(state.pages.data[id], 'saved', {})
}
//#endregion
//#region
export function successDeletePost(state, id) {
  Vue.delete(state.posts.data, id)
}
export function successDeletePage(state, id) {
  Vue.delete(state.pages.data, id)
}
//#endregion
//#region edit
export function editPost(state, { id, obj }) {
  Vue.set(state.posts.data[id], 'modify', obj)
}
export function editPage(state, { id, obj }) {
  Vue.set(state.pages.data[id], 'modify', obj)
}
//#endregion
//#region publish
export function successPublish1(state, res) {
  Vue.set(state.posts.data, res._id, {
    data: res,
    loading: false,
    modify: {},
    saved: {}
  })
}
export function successPublish2(state, id) {
  Vue.delete(state.posts.data, id)
}
//#endregion
//#region reset
export function reset(state) {
  successListPosts(state, [])
  successListPages(state, [])
  successListTags(state, [])
  successListCategories(state, [])
}
//#endregion
