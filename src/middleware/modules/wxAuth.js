/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion 微信公众号路由守卫
 * @Date 2022-01-21 14:36:07
 * @LastEditors ZhenYuTsai
 */
import store from '../../store/index'
const appid = process.env.VUE_APP_WX_APPID
const redirectUri = process.env.VUE_APP_BASEURL

export const beforeEach = (to, from, next) => {
  const wxRedirectUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=1&state=state#wechat_redirect`
  if (to.meta.wxAuth) {
    if (store.getters.getToken) { // 判断是否已经存在登录信息
      console.log(store.getters)
      return next()
    } else if (to.query.code) { // 判断是否已经回调并非返回code
      setTimeout(() => {
        // 在这里调用查询用和信息接口,获取token
        store.dispatch('setToken', 'fasdfadsfewrewqrqewrwqq')
        store.dispatch('setThirdToken', 'fasdfadsfewrewqrqewrwqq')
        store.dispatch('setUserInfo', { name: '哈哈', role: 'admin', userId: '001' })
        return next()
      }, 4000)
    } else if (/MicroMessenger/i.test(window.navigator.userAgent)) { // 进入微信回调鉴权
      location.href = wxRedirectUrl
    } else { // 判断是否是微信环境
      return next()
    }
  } else {
    return next()
  }
}

export const afterEach = (to, from) => {

}
