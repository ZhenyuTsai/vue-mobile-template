import router from '@/router'
import store from '@/store'
import app from '@/utils/app'
// eslint-disable-next-line camelcase
import app_v2 from '@/utils/app_v2'
import $customer from '@/api/customer'
import {
  validator
} from '@/utils/common'
const loginPath = '/login'
function doFilter () {
  router.beforeEach((to, from, next) => {
    // 无需登录则跳出
    if (to.meta.loginAuth === undefined || !to.meta.loginAuth) {
      return next()
    }
    console.log(store.getters.getToken)

    // 判断Token有效性
    if (store.getters.getToken) {
      checkLogin().then(res => {
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
      } else {
        app.jumpValue({
          pageCode: app.PAGE_CODE_ENUM.CUSTOMER_LOGIN
        })
      }
    })
  } else if (visitType === 'app_v2') {
    // 调用APP的getToken方法处理
    app_v2.getToken().then(res => {
      if (res.token && res.token !== '') {
        store.dispatch('setToken', res.token)
        return next()
      } else {
        app_v2.login()
      }
    })
  } else if (visitType === 'wx') {
    if (!validator.isEmpty(store.getters.getThirdToken)) {
      return next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
    // 根据thirdToken进行处理
    $customer.thirdLogin({
      thirdToken: store.getters.getThirdToken
    }).then(res => {
      if (res.result === '0') {
        store.dispatch('setThirdToken', res.thirdToken)
        store.dispatch('setToken', res.token)
        return next()
      } else if (res.result === '1') {
        return next({
          path: loginPath,
          query: {
            redirect: to.fullPath
          }
        })
      } else if (res.result === '3') {
        store.dispatch('setThirdToken', res.thirdToken)
      } else if (res.result === '4') {
        store.dispatch('setThirdToken', res.thirdToken)
      } else if (res.result === '6') {
        return next({
          path: loginPath,
          query: {
            redirect: to.fullPath
          }
        })
      }
    })
    // 没有thirdToken跳登陆
  } else if (visitType === 'alipay') {
    if (!validator.isEmpty(store.getters.getThirdToken)) {
      return next({
        path: loginPath,
        query: {
          redirect: to.fullPath
        }
      })
    }
    // 根据thirdToken进行处理
    $customer.thirdLogin({
      thirdToken: store.getters.getThirdToken
    }).then(res => {
      if (res.result === '0') {
        store.dispatch('setThirdToken', res.thirdToken)
        store.dispatch('setToken', res.token)
        return next()
      } else if (res.result === '1') {
        return next({
          path: loginPath,
          query: {
            redirect: to.fullPath
          }
        })
      } else if (res.result === '3') {
        store.dispatch('setThirdToken', res.thirdToken)
        // 跳用户授权页
      } else if (res.result === '4') {
        store.dispatch('setThirdToken', res.thirdToken)
        // 手机认证页
      } else if (res.result === '6') {
        return next({
          path: loginPath,
          query: {
            redirect: to.fullPath
          }
        })
      }
    })
  } else if (visitType === 'alimini') {
    window.my.onMessage = function (params) {
      console.log('onMessage:' + JSON.stringify(params))
      store.dispatch('setThirdToken', params.thirdToken)
      store.dispatch('setToken', params.token)
      return next()
    }
    window.my.postMessage({ functionName: 'getToken', dataObject: 'onMpCallBack' })
  } else if (visitType === 'wxwork') {
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href
  } else {
    return next({
      path: loginPath,
      query: {
        redirect: to.fullPath
      }
    })
  }
}

export default {
  doFilter
}
