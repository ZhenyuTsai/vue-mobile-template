/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion 全局路由守卫中间件
 * @Date 2022-01-11 11:30:15
 * @LastEditors ZhenYuTsai
 */
const requireModules = require.context('./modules', false, /\.js$/)
const middleware = ['general', 'wxAuth']
export default (Vue, { router }) => {
  // 全局前置守卫
  middleware.forEach(item => {
    const key = './' + item + '.js'
    if (requireModules(key).beforeEach) {
      router.beforeEach((to, from, next) => {
        requireModules(key).beforeEach(to, from, next, Vue)
      })
    }
  })
  // 全局后置守卫
  middleware.forEach(item => {
    const key = './' + item + '.js'
    router.afterEach((to, from) => {
      if (requireModules(key).afterEach) {
        requireModules(key).afterEach(to, from, Vue)
      }
    })
  })
}
