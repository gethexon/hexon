import LTT from 'list-to-tree'
import { date } from 'quasar'
import { DATE_FORMAT } from 'src/utils/constants'
export function modifiedPost(state) {
  return id => {
    if (!state.posts.data[id]) return null
    const obj = {}
    Object.assign(obj, state.posts.data[id].data.fm)
    if (obj.date) obj.date = date.formatDate(obj.date, DATE_FORMAT)
    if (obj.updated) obj.updated = date.formatDate(obj.updated, DATE_FORMAT)
    Object.assign(obj, state.posts.data[id].saved)
    Object.assign(obj, state.posts.data[id].modify)
    return obj
  }
}
export function modifiedPage(state) {
  return id => {
    const obj = {}
    if (!state.pages.data[id]) return null
    Object.assign(obj, state.pages.data[id].data.fm)
    if (obj.date) obj.date = date.formatDate(obj.date, DATE_FORMAT)
    if (obj.updated) obj.updated = date.formatDate(obj.updated, DATE_FORMAT)
    Object.assign(obj, state.pages.data[id].saved)
    Object.assign(obj, state.pages.data[id].modify)
    return obj
  }
}
export function categoriesList(state) {
  const obj = state.categories.data
  const list = Object.keys(obj).map(key => obj[key].data)
  return list
}
export function categoriesTreeNodes(state) {
  const list = categoriesList(state).map(obj => {
    if (obj.parent === undefined) obj.parent = 0
    return obj
  })
  const ltt = new LTT(list, {
    key_id: '_id',
    key_parent: 'parent',
    key_child: '_child'
  })
  return ltt.GetTree() || []
}
export function tagsList(state) {
  const obj = state.tags.data
  return Object.keys(obj).map(key => obj[key].data)
}
export function postCount(state) {
  return Object.keys(state.posts.data).length
}
export function pageCount(state) {
  return Object.keys(state.pages.data).length
}
export function totalCount(state) {
  return Object.keys(state.posts.data).length + Object.keys(state.pages.data).length
}
export function draftCount(state) {
  const postsObj = state.posts.data
  const postsList = Object.keys(postsObj).map(key => postsObj[key].data)
  return postsList.filter(p => !p.published).length
}
