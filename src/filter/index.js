import third from './third'
import thirdCallback from './thirdCallback'
import login from './login'
import silentLogin from './silentLogin'
import wx from './weixin'
import common from './common'

function doFilters () {
  common.doFilter()
  third.doFilter()
  thirdCallback.doFilter()
  wx.doFilter()
  login.doFilter()
  silentLogin.doFilter()
  //  customer.doFilter()
}

export default {
  doFilters
}
