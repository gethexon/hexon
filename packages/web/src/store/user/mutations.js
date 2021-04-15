export function requestLogin(state) {
  state.alive = false
  state.pending = true
  state.err = ''
}
export function successLogin(state) {
  state.alive = true
  state.pending = false
}
export function failedLogin(state, err) {
  state.alive = false
  state.pending = false
  state.err = err
}
export function requestInfo(state) {
  state.info.data = {}
  state.info.loading = true
  state.info.err = ''
}
export function successInfo(state, info) {
  successLogin(state)
  state.info.data = info
  state.info.loading = false
}
export function failedInfo(state, err) {
  state.info.data = {}
  state.info.loading = false
  state.info.err = err
}
export function logout(state, err) {
  state.alive = false
  state.pending = false
  state.err = err || ''
  state.info.data = {}
}
export function check(state) {
  state.first = false
}
