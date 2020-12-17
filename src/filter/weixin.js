import router from '@/router'
import store from '@/store'
import {
  validator
} from '@/utils/common'
import wx from '@/utils/weixin'
import wxwork from '@/utils/wxwork'
export default {
  doFilter () {
    router.beforeEach((to, from, next) => {
      if (store.getters.getType == 'wx' &&
        validator.isEmpty(to.meta.wx) &&
        validator.isEmpty(to.meta.wx.sign) &&
        to.meta.wx.sign &&
        validator.isEmpty(to.meta.wx.jsApiList) &&
        validator.isArray(to.meta.wx.jsApiList) &&
        to.meta.wx.jsApiList.length > 0) {
        wx.init({
          apiList: to.meta.wx.jsApiList
        })
      }
      if (store.getters.getVisitType === 'wxwork' &&
        validator.isEmpty(to.meta.wxwork) &&
        validator.isEmpty(to.meta.wxwork.sign) &&
        to.meta.wxwork.sign &&
        validator.isEmpty(to.meta.wxwork.jsApiList) &&
        validator.isArray(to.meta.wxwork.jsApiList) &&
        to.meta.wxwork.jsApiList.length > 0) {
        wxwork.init({
          apiList: to.meta.wxwork.jsApiList
        })
      }
      return next()
    })
  }
}
