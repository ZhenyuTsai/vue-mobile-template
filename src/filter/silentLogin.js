import router from '@/router'
import store from '@/store'
import app from '@/utils/app'
// eslint-disable-next-line camelcase
import app_v2 from '@/utils/app_v2'
import $customer from '@/api/customer'
import common, { validator } from '@/utils/common'

function doFilter () {
  router.beforeEach((to, from, next) => {
    if (to.meta.silentLogin === undefined || !to.meta.silentLogin) {
      return next()
    }
    // 判断Token有效性
    if (store.state.auth.token) {
      checkLogin().then(res => {
        // 当 third 无效时 移除
        if (!res.third) {
          store.dispatch('removeThirdToken')
        }
        if (res.token) {
          return next()
        } else {
          // 清除失效Token
          store.dispatch('removeToken')
          return goLogin(to, from, next)
        }
      })
    } else {
      return goLogin(to, from, next)
    }
  })
}

function checkLogin () {
  // TODO 调用esp/customer或者对应平台的Token验证方法
  return $customer.accountCheck({
    token: store.getters.getToken,
    third: store.getters.getThirdToken
  })
}
function goLogin (to, from, next) {
  // 进行登陆处理
  const visitType = store.getters.getVisitType
  if (visitType === 'app') {
    // 调用APP的getToken方法处理
    app.getToken().then((res) => {
      if (res.nativeData && res.nativeData.token && res.nativeData.token !== '') {
        store.dispatch('setToken', res.nativeData.token)
        return next()
      }
    })
  } else if (visitType === 'app_v2') {
    // 调用APP的getToken方法处理
    app_v2.getToken().then(res => {
      if (res.token && res.token !== '') {
        store.dispatch('setToken', res.token)
        return next()
      }
    })
  } else if (visitType === 'wx') {
    if (!validator.isEmpty(store.getters.getThirdToken)) {
      return next()
    }
    // 根据thirdToken进行处理
    console.log('HR-Filter [silent login] - third login wx', store.getters.getThirdToken)
    $customer.thirdLogin({
      thirdToken: store.getters.getThirdToken
    }).then(res => {
      if (res.result === '0') {
        console.log('HR-Filter [silent login] - third login wx', 'ok')
        store.dispatch('setThirdToken', res.thirdToken)
        store.dispatch('setToken', res.token)
        if (common.getUrlCode().code) {
          const character = location.href.indexOf('?code=') !== -1 ? '?code=' : '&code='
          location.replace(location.href.substring(0, location.href.indexOf(character)))
        }
        return next()
      }
    })
    // 没有thirdToken跳登陆
  } else if (visitType === 'alipay') {
    if (!validator.isEmpty(store.getters.getThirdToken)) {
      return next()
    }
    // 根据thirdToken进行处理
    console.log('HR-Filter [silent login] - third login alipay', store.getters.getThirdToken)
    $customer.thirdLogin({
      thirdToken: store.getters.getThirdToken
    }).then(res => {
      if (res.result === '0') {
        console.log('HR-Filter [silent login] - third login alipay', 'ok')
        store.dispatch('setThirdToken', res.thirdToken)
        store.dispatch('setToken', res.token)
        return next()
      }
    })
  }
  return next()
}

export default {
  doFilter
}
