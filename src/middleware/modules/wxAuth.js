/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion 微信公众号路由守卫
 * @Date 2022-01-21 14:36:07
 * @LastEditors ZhenYuTsai
 */
const appid = process.env.VUE_APP_WX_APPID
const redirectUri = process.env.VUE_APP_BASEURL

export const beforeEach = (to, from, next) => {
  if (to.meta.wxAuth) {
    if (to.query.code) {
      // 判断是否已经回调并非返回code
      setTimeout(() => {
        // 在这里调用查询用和信息接口
        return next()
      }, 4000)
    } else if (!/MicroMessenger/i.test(window.navigator.userAgent)) {
      // 判断是否是微信环境
      return next()
    } else {
      // 进入微信回调鉴权
      location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=1&state=state#wechat_redirect`
    }
  } else {
    return next()
  }
}

export const afterEach = (to, from) => {

}
