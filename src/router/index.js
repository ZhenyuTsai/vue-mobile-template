import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'home',
  component: Home,
  meta: {
    // 页面title
    title: '国华人寿',
    // 是否需要登陆
    loginAuth: false,
    // 是否需要获取第三方信息(当无需登录，且通过微信、支付宝等第三方访问时有效)
    thirdAuth: false,
    // 是否需要静默登录
    silentLogin: false,
    // 第三方登陆方式(base、userinfo)
    thirdScopeType: 'base',
    // 跳转页面是否需要打开全局遮罩
    isOpenGlobalMask: true,
    backtrack: {
      isBacktrack: true
    },
    dot: {
      code: 'P001',
      name: '首页1111',
      classMatch: '^(-name)', // 页面  匹配
      browseTime: 10,
      allMonitor: true,
      actionRules: [{
        code: 'P001A001',
        name: '埋点测试id',
        rule: {
          type: 'id',
          value: 'A01'
        }
      }, {
        code: 'P001A002',
        name: '埋点测试class',
        rule: {
          type: 'class',
          value: '-name$'
        }
      }]
    },
    wx: {
      sign: false, // 是否需要使用微信支付、分享、获取用户地址坐标
      jsApiList: ['chooseWXPay', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'getLocation'] // 该页面需要用到的方法 chooseWXPay onMenuShareAppMessage onMenuShareTimeline getLocation
      /**
       * chooseWXPay:微信支付
       * 'onMenuShareAppMessage', 'onMenuShareTimeline'：分享给好友，以及分享到朋友圈
       * getLocation:获取当前用户地址坐标
       */
    }
  }
},
{
  path: '/about',
  name: 'about',
  component: () => import('../views/About.vue'),
  meta: {
    // 页面title
    title: '阿里巴巴',
    // 是否需要登陆
    loginAuth: false,
    // 是否需要获取第三方信息(当无需登录，且通过微信、支付宝等第三方访问时有效)
    thirdAuth: false,
    // 是否需要静默登录
    silentLogin: false,
    // 第三方登陆方式(base、userinfo)
    thirdScopeType: 'base',
    // 跳转页面是否需要打开全局遮罩
    isOpenGlobalMask: true,
    backtrack: {
      isBacktrack: true
    },
    dot: {
      code: 'P001',
      name: '首页1111',
      classMatch: '^(-name)', // 页面  匹配
      browseTime: 10,
      allMonitor: true,
      actionRules: [{
        code: 'P001A001',
        name: '埋点测试id',
        rule: {
          type: 'id',
          value: 'A01'
        }
      }, {
        code: 'P001A002',
        name: '埋点测试class',
        rule: {
          type: 'class',
          value: '-name$'
        }
      }]
    },
    wx: {
      sign: false, // 是否需要使用微信支付、分享、获取用户地址坐标
      jsApiList: ['chooseWXPay', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'getLocation'] // 该页面需要用到的方法 chooseWXPay onMenuShareAppMessage onMenuShareTimeline getLocation
      /**
       * chooseWXPay:微信支付
       * 'onMenuShareAppMessage', 'onMenuShareTimeline'：分享给好友，以及分享到朋友圈
       * getLocation:获取当前用户地址坐标
       */
    }
  }
},
{
  path: '/login',
  name: 'login',
  component: () => import(/* webpackChunkName: 'demo' */ '../views/Login.vue'),
  meta: {
    // 页面title
    title: '国华人寿',
    // 是否需要登陆
    loginAuth: false,
    // 是否需要获取第三方信息(当无需登录，且通过微信、支付宝等第三方访问时有效)
    thirdAuth: false,
    // 是否需要静默登录
    silentLogin: false,
    // 第三方登陆方式(base、userinfo)
    thirdScopeType: 'base',
    // 跳转页面是否需要打开全局遮罩
    isOpenGlobalMask: true,
    wx: {
      sign: false, // 是否需要使用微信支付、分享、获取用户地址坐标
      jsApiList: ['chooseWXPay', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'getLocation'] // 该页面需要用到的方法 chooseWXPay onMenuShareAppMessage onMenuShareTimeline getLocation
      /**
       * chooseWXPay:微信支付
       * 'onMenuShareAppMessage', 'onMenuShareTimeline'：分享给好友，以及分享到朋友圈
       * getLocation:获取当前用户地址坐标
       */
    }
  }
}
]

export default new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_PUBLIC_PATH,
  routes
})
