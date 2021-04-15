export function setFilter(state, { type, id }) {
  state.filter.type = type
  state.filter.id = id
}
export function setSort(state, { key, ascend }) {
  state.sort.key = key
  state.sort.ascend = ascend
}
export function reset(state) {
  setFilter(state, { type: 'all' })
  setSort(state, { key: 'date', ascend: false })
}
export function showLoading(state, text) {
  state.loading.show = true
  state.loading.text = text
}
export function hideLoading(state) {
  state.loading.show = false
}
