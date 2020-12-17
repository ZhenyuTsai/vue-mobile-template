import http from '../utils/http'

const URL = process.env.VUE_APP_BASE_WXWORK

export default {
  //获取用户信息
  judgmentSystem (params) {
    return http.post(URL + '/camp/user/judgmentSystem', params)
  },
  checkToken (params) {
    return http.get(URL + '/camp/user/public/checkToken', params)
  }
}