/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion
 * @Date 2022-01-21 17:38:44
 * @LastEditors ZhenYuTsai
 */
export default (Vue) => {
  Vue.mixin({
    methods: {
      openLoading () {
        const app = document.getElementById('app')
        const loading = document.createElement('div')
        loading.id = 'loading'
        app.style.display = 'none'
        document.body.insertBefore(loading, app)
      },
      closeLoading () {
        const loading = document.getElementById('loading')
        const app = document.getElementById('app')
        app.style.display = 'block'
        document.body.removeChild(loading)
      }
    }
  })
}
