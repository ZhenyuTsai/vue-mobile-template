/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion 通用路由守卫
 * @Date 2022-01-21 16:51:28
 * @LastEditors ZhenYuTsai
 */
export const beforeEach = (to, from, next, Vue) => {
  document.title = to.meta.title
  Vue.openLoading()
  // 判断是否是微信环境
  if (/MicroMessenger/i.test(window.navigator.userAgent)) {
    // 判断安卓还是ios环境,记录ios进入页面第一个路径值用于微信config鉴权
    if (!Vue.prototype.signLink || /(Android)/i.test(navigator.userAgent)) {
      Vue.prototype.signLink = location.href
    }
  }
  next()
}

export const afterEach = (to, from, Vue) => {
  if (to.name === 'Error') {
    Vue.closeLoading()
  }
}
