import router from './router'

function doFilter () {
  router.beforeEach((to, from, next) => {
    console.log(from)
    console.log(to)

    // 判断是否需要客户操作Token，需要则判断是否存在，无需check刷新

    next()

  })
}

export default { doFilter }