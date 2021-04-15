import sha1 from 'crypto-js/sha1'
import services from 'src/services'
import { origin, request } from './request'
export default {
  login: async (name, pass) => {
    const res = await origin.post('/login', undefined, {
      auth: {
        username: name,
        password: sha1(pass).toString()
      }
    })
    services.auth.setAccessToken(res.data.accessToken)
    services.auth.setRefreshToken(res.data.refreshToken)
    return res.data
  },
  info: async () => {
    return request.get('/info')
  },
  logout: async () => {
    return request.post('/logout')
  },
  refresh: async () => {
    const res = await origin.post('/refresh', undefined, {
      headers: {
        Authorization: 'Bearer ' + services.auth.getRefreshToken()
      }
    })
    services.auth.setAccessToken(res.data.accessToken)
    services.auth.setRefreshToken(res.data.refreshToken)
  },
}
