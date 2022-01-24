/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion 全局路由守卫中间件
 * @Date 2022-01-11 11:30:15
 * @LastEditors ZhenYuTsai
 */
const requireModules = require.context('./modules', false, /\.js$/)
export default (Vue, { router }) => {
  console.log(requireModules.keys())
  // 全局前置守卫
  router.beforeEach((to, from, next) => {
    console.log(to, from)
    requireModules.keys().forEach(key => {
      if (requireModules(key).beforeEach) {
        requireModules(key).beforeEach(to, from, next)
      }
    })
  })
  // 全局后置守卫
  router.afterEach((to, from) => {
    requireModules.keys().forEach(key => {
      if (requireModules(key).afterEach) {
        requireModules(key).afterEach(to, from)
      }
    })
  })
}
