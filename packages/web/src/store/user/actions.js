import api from "src/api"
import { NetworkError } from "src/api/request";
import services from "src/services";

export async function login({ commit, dispatch }, { name, pass }) {
  commit('requestLogin')
  try {
    await api.auth.login(name, pass)
    await dispatch('info')
    dispatch('init', null, { root: true })
    commit('successLogin')
  } catch (err) {
    commit('failedLogin', err instanceof NetworkError ? err.message : 'unknown error')
    if (!(err instanceof NetworkError)) throw err
  }
}

export async function logout({ commit }) {
  try {
    await api.auth.logout()
    commit('logout')
  } catch (err) {
    commit('logout', err instanceof NetworkError ? err.message : 'unknown error')
    if (!(err instanceof NetworkError)) throw err
  } finally {
    services.auth.destory()
    commit('hexo/reset', null, { root: true })
    commit('ui/reset', null, { root: true })
  }
}

export async function info({ commit }) {
  commit('requestInfo')
  try {
    const info = (await api.auth.info()).data
    commit('successInfo', info)
  } catch (err) {
    commit('failedInfo', err)
    if (!(err instanceof NetworkError)) throw err
  }
}
