import http from '../utils/http'
import store from '../store/index'

const URL = process.env.VUE_APP_BASE_CUSTOMER
const VIDEO_URL = 'https://dat-m.95549.cn/restful/traceback'
export default {
  // 验证用户登录状态
  accountCheck (params = {}) {
    params.type = store.getters.getType
    params.system = store.getters.getSystem
    params.third = store.getters.getThirdToken
    params.token = store.getters.getToken
    return http.get(URL + '/account/check', params)
  },
  // 获取第三方信息
  thirdInfo (params) {
    return http.get(URL + '/third/login', params)
  },
  // 使用第三方账户进行账户登陆
  thirdLogin (params) {
    return http.get(URL + '/third/login', params)
  },
  // 第三方快捷登陆
  thirdAuth (params) {
    params.type = store.getters.getType
    params.system = store.getters.getSystem
    return http.get(URL + '/third/auth', params)
  },
  // 登陆
  login (params) {
    params.type = store.getters.getType
    params.system = store.getters.getSystem
    return http.get(URL + '/account/login', params)
  },
  // 获取用户信息
  accountInfo (params) {
    return http.post(URL + '/account/info', params)
  },
  // 发送短信验证码
  smsSend (params) {
    params.type = store.getters.getType
    params.system = store.getters.getSystem
    return http.post(URL + '/verify/sms', {
      data: params,
      contentType: 'form'
    })
  },
  // 微信授权分享
  chImg (params) {
    params.type = store.getters.getType
    params.system = store.getters.getSystem
    return http.post(URL + '/common/initParams', {
      data: params,
      contentType: 'form'
    })
  },
  getUserList (params) {
    return http.get(URL + '/user/listpage', params)
  },
  wxworkSign (params) {
    return http.post(URL + '/third/initParams/qywx', {
      data: params,
      contentType: 'form'
    })
  },
  getVideo (params) {
    return http.get(VIDEO_URL + '/analysis/video/json', params)
  },
  addVideo (params) {
    return http.post(VIDEO_URL + '/analysis/video', {
      data: params
      // contentType: 'form'
    })
  }
}
