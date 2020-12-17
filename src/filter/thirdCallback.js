import router from '@/router/'
import store from '@/store'
import $customer from '@/api/customer'
import $wxwork from '@/api/wxwork'
import common, { validator } from '@/utils/common'

function doFilter () {
  router.beforeEach((to, from, next) => {
    const thirType = store.getters.getThirdType
    // 非第三方环境不处理
    if (!validator.isEmpty(thirType)) {
      return next()
    }
    if (!to.meta.thirdAuth) {
      return next()
    }
    // eslint-disable-next-line camelcase
    const third_redirect_code = common.getUrlCode().code || common.getUrlCode().auth_code
    if (!validator.isEmpty(third_redirect_code)) {
      return next()
    }
    if (store.getters.getVisitType === 'wxwork') {
      if (validator.isEmpty(store.getters.getToken)) {
        $wxwork.checkToken({
          token: store.getters.getToken
        }).then(res => {
          if (validator.isEmpty(res.token)) {
            return next()
          }
        })
      } else {
        // 企业微信通过code登陆
        $wxwork.judgmentSystem({
          code: third_redirect_code,
          systemType: store.getters.getType
        }).then(res => {
          if (res && res.result === '0') {
            store.dispatch('setToken', res.token)
            store.dispatch('setThirdInfo', { userCode: res.userCode, userName: res.userName, organCode: res.organCode })
            store.dispatch('setSystem', res.systemType)
          }
          return next()
        })
      }
      return next()
    }
    // 根据不同的thirdType和后端交互，创建thirdToken
    console.log('HR-Filter [third callback] - third auth', third_redirect_code)
    $customer.thirdAuth({
      scope: to.meta.thirdScopeType || '',
      thirdType: thirType,
      code: third_redirect_code,
      isLogin: '1'
    }).then((res1) => {
      if (validator.isEmpty(res1.thirdToken)) {
        console.log('HR-Filter [third callback] - third auth', 'ok')
        store.dispatch('setThirdToken', res1.thirdToken)
        if ((!validator.isEmpty(store.getters.getNickName)) && (!validator.isEmpty(store.getters.getImgUrl))) {
          console.log('HR-Filter [third callback] - third info', store.getters.getThirdToken)
          $customer.thirdInfo({
            thirdToken: store.getters.getThirdToken
          }).then((res2) => {
            if (validator.isEmpty(res2.thirdUserName) || validator.isEmpty(res2.thirdImageUrl)) {
              store.dispatch('setThirdInfo', { nickName: res2.thirdUserName, imgUrl: res2.thirdImageUrl })
            }
            return next()
          })
        } else {
          return next()
        }
      } else {
        const character = location.href.indexOf('?code=') !== -1 ? '?code=' : '&code='
        location.replace(location.href.substring(0, location.href.indexOf(character)))
      }
      return next()
    })
  })
}

export default { doFilter }
