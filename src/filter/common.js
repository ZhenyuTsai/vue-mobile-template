/* eslint-disable */
import router from '@/router'
import commonUtils from '@/utils/common'
import store from "@/store/index"
import $customer from "@/api/customer"
import { validator } from '@/utils/common'
function doFilter () {
  router.beforeEach((to, from, next) => {
    if (to.meta.isOpenGlobalMask) {
      //跳转页面时打开全局遮罩，根据路由配置参数决定是否打开遮罩
      commonUtils.openGlobalMask()
      setTimeout(() => {
        commonUtils.closeGlobalMask()
      }, 1000)
    }
    next()
  })
  router.afterEach((to, from) => {
    commonUtils.setTitle(to.meta.title)//为每个页面单独设置title
    setTimeout(() => {
      //统计方法调用无需使用统计请注释相关代码
      baidu_tj(to, from)
      tj_99click(to, from)
    }, 20)
  })
}

/**
 * 百度统计
 * 使用时各系统自行将.env文件中VUE_APP_BAIDU_TJ_CODE更改为相应系统的百度统计代码
 */
function baidu_tj (to, from) {
  var _hmt = _hmt || []
  //每次执行前，先移除上次插入的代码
  document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove()
  var hm = document.createElement('script')
  hm.src = '//hm.baidu.com/hm.js?' + process.env.VUE_APP_BAIDU_TJ_CODE
  hm.id = 'baidu_tj'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
}

/***
* 99Click统计
* 调用接口，通过token获取customerId
* 将获取到的customerId传给回调函数 ，进行后续的code统计
* 使用时请先更改public文件夹下index.html中99click代码为相应系统专用代码
* 如有其它特殊逻辑请自行修改
*/
function tj_99click (to, from) {
  var token = store.getters.getToken
  if (token) {
    $customer.accountCheck({
      token: store.getters.getToken,
    }).then(res => {
      if (validator.isEmpty(res.token)) {
        store.dispatch('setToken', res.token)
        //调用接口获取customerID
        $customer.accountInfo({ isUserId: 1 }).then((content) => {
          window._ozuid = content && content.userId ? content.userId : ''
          if (from.name != null) {
            window.__ozfac2 ? window.__ozfac2('') : false
          }
        })
      } else {
        if (from.name != null) {
          window.__ozfac2 ? window.__ozfac2('') : false
        }
      }
    })
  } else {
    if (from.name != null) {
      window.__ozfac2 ? window.__ozfac2('') : false
    }
  }
}

export default { doFilter }