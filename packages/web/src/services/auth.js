import { LocalStorage } from "quasar";
const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const auth = {
  setAccessToken: (token) => {
    LocalStorage.set(ACCESS_TOKEN_KEY, token)
  },

  setRefreshToken: (token) => {
    LocalStorage.set(REFRESH_TOKEN_KEY, token)
  },

  getAccessToken: () => {
    return LocalStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken: () => {
    return LocalStorage.getItem(REFRESH_TOKEN_KEY)
  },

  destory: () => {
    LocalStorage.remove(ACCESS_TOKEN_KEY)
    LocalStorage.remove(REFRESH_TOKEN_KEY)
  },

  hasToken: () => {
    return auth.getAccessToken() && auth.getRefreshToken()
  }
}
export default auth
