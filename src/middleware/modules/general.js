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
  next()
}

export const afterEach = (to, from, Vue) => {
  if (to.name === 'error') {
    Vue.closeLoading()
  }
}
