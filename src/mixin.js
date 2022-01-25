/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion 全局混入方法
 * @Date 2022-01-21 17:38:44
 * @LastEditors ZhenYuTsai
 */
export default (Vue) => {
  /**
   * @author ZhenYuTsai
   * @description 打开全局加载中
   * @return {*}
   * @lastEditors ZhenYuTsai
   */
  const openLoading = () => {
    const app = document.getElementById('app')
    const loading = document.createElement('div')
    loading.id = 'loading'
    app.style.display = 'none'
    document.body.insertBefore(loading, app)
  }
  /**
   * @author ZhenYuTsai
   * @description 关闭全局加载中
   * @return {*}
   * @lastEditors ZhenYuTsai
   */
  const closeLoading = () => {
    const loading = document.getElementById('loading')
    const app = document.getElementById('app')
    app.style.display = 'block'
    if (loading) {
      document.body.removeChild(loading)
    }
  }
  Vue.openLoading = openLoading
  Vue.prototype.openLoading = openLoading
  Vue.closeLoading = closeLoading
  Vue.prototype.closeLoading = closeLoading
}
