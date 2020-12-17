import router from '@/router/'
import store from '@/store'
import $customer from '@/api/customer'
import { validator } from '@/utils/common'
import common from '@/utils/common'

function doFilter () {
  router.beforeEach((to, from, next) => {
    console.log(from)
    console.log(to)

    let thirdType = store.getters.getThirdType
    //非第三方环境不处理
    if (!validator.isEmpty(thirdType)) {
      return next()
    }
    let third_redirect_code = common.getUrlCode().code || common.getUrlCode().auth_code
    let wx_redirect_url = ''
    if (to.meta.thirdAuth) {
      if (store.getters.getThirdToken) {
        // 验证token有效性
        //checkThirdToken
        $customer.accountCheck({
          third: store.getters.getThirdToken
        }).then(res => {
          if (validator.isEmpty(res.third)) {
            store.dispatch('setThirdToken', res.third)
            // 判断user中ThirdInfo是否失效，失效重新获取缓存
            if (!(validator.isEmpty(store.getters.getNickName) || validator.isEmpty(store.getters.getImgUrl))) {
              $customer.thirdInfo({
                thirdToken: store.getters.getThirdToken
              }).then(res => {
                if (validator.isEmpty(res.thirdUserName) && validator.isEmpty(res.thirdImageUrl)) {
                  store.dispatch('setThirdInfo', { nickName: res.thirdUserName, imgUrl: res.thirdImageUrl })
                }
                return next()
              })
            } else {
              return next()
            }
          } else {
            //跳平台授权页
            if (validator.isEmpty(third_redirect_code)) {
              return next()
            }
            console.log('appid=' + store.getters.getThirdAppId)
            if (store.getters.getVisitType === 'wx') {
              if (validator.isEmpty(to.meta.thirdScopeType) && to.meta.thirdScopeType === 'base') {
                wx_redirect_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.getters.getThirdAppId + '&redirect_uri=' + encodeURIComponent('https://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath) + '&response_type=code&scope=snsapi_base&state=2#wechat_redirect'
              } else if (validator.isEmpty(to.meta.thirdScopeType) && to.meta.thirdScopeType === 'userinfo') {
                wx_redirect_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.getters.getThirdAppId + '&redirect_uri=' + encodeURIComponent('https://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath) + '&response_type=code&scope=snsapi_userinfo&state=2#wechat_redirect'
              }
            } else if (store.getters.getVisitType === 'alipay') {
              if (validator.isEmpty(to.meta.thirdScopeType) && to.meta.thirdScopeType === 'base') {
                wx_redirect_url = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' + store.getters.getThirdAppId + '&auth_skip=false&scope=auth_base&redirect_uri=' + encodeURIComponent('https://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath) + '&state=2'
              } else if (validator.isEmpty(to.meta.thirdScopeType) && to.meta.thirdScopeType === 'userinfo') {
                wx_redirect_url = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' + store.getters.getThirdAppId + '&auth_skip=false&scope=auth_userinfo&redirect_uri=' + encodeURIComponent('https://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath) + '&state=2'
              }
            } else if (store.getters.getVisitType === 'alimini') {
              window.my.postMessage({ functionName: 'getToken', dataObject: 'onMpCallBack' })
              window.my.onMessage = function (params) {
                store.dispatch('setThirdToken', params.thirdToken)
                store.dispatch('setToken', params.token)
                return next()
              }
            } else if (store.getters.getVisitType === 'wxwork') {
              //新增企业微信授权登陆
              wx_redirect_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${store.getters.getThirdAppId}&redirect_uri=${encodeURIComponent('http://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath)}&response_type=code&scope=snsapi_base&state=2&connect_redirect=1#wechat_redirect`
            }
            return window.location.href = wx_redirect_url
          }
        })
      } else {
        // 根据不同第三方类型，进行第三方快登处理
        //跳平台授权页
        if (validator.isEmpty(third_redirect_code)) {
          return next()
        }
        console.log('appid=' + store.getters.getThirdAppId)
        if (store.getters.getVisitType === 'wx') {
          if (validator.isEmpty(to.meta.thirdScopeType) && to.meta.thirdScopeType === 'base') {
            wx_redirect_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.getters.getThirdAppId + '&redirect_uri=' + encodeURIComponent('https://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
          } else if (validator.isEmpty(to.meta.thirdScopeType) && to.meta.thirdScopeType === 'userinfo') {
            wx_redirect_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.getters.getThirdAppId + '&redirect_uri=' + encodeURIComponent('https://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
          }
        } else if (store.getters.getVisitType === 'alipay') {
          if (validator.isEmpty(to.meta.thirdScopeType) && to.meta.thirdScopeType === 'base') {
            wx_redirect_url = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' + store.getters.getThirdAppId + '&auth_skip=false&scope=auth_base&redirect_uri=' + encodeURIComponent('https://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath) + '&state=1'
          } else if (validator.isEmpty(to.meta.thirdScopeType) && to.meta.thirdScopeType === 'userinfo') {
            wx_redirect_url = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' + store.getters.getThirdAppId + '&auth_skip=false&scope=auth_userinfo&redirect_uri=' + encodeURIComponent('https://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath) + '&state=1'
          }
        } else if (store.getters.getVisitType === 'alimini') {
          window.my.postMessage({ functionName: 'getToken', dataObject: 'onMpCallBack' })
          window.my.onMessage = function (params) {
            store.dispatch('setThirdToken', params.thirdToken)
            store.dispatch('setToken', params.token)
            return next()
          }
        } else if (store.getters.getVisitType === 'wxwork') {
          wx_redirect_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${store.getters.getThirdAppId}&redirect_uri=${encodeURIComponent('http://' + process.env.VUE_APP_BASEURL + process.env.VUE_APP_BASE_PUBLIC_PATH + to.fullPath)}&response_type=code&scope=snsapi_base&state=2&connect_redirect=1#wechat_redirect`
        }
        return window.location.href = wx_redirect_url
      }
    } else {
      return next()
    }
  })
}

export default { doFilter }
