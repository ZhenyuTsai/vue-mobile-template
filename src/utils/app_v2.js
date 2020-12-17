/* eslint-disable */
//返回promise函数
import validator from '@/utils/validator'
let appCallBackFuncs = {
  webview_right_button: function () { },
  webview_set_button: function () { },
  webview_left_button: function () { },
  webview_closed: function () { },
  weixin_share: function () { },
  login_cancel: function () { }
}
window.appCallBack = function (data) {
  console.log('回调')
  console.log(data)
  if (data.trigger && data.trigger == 'webview_right_button') {
    console.log('webview_right_button')
    appCallBackFuncs.webview_right_button()
  } else if (data.trigger && data.trigger == 'webview_set_button') {
    console.log('webview_right_button')
    appCallBackFuncs.webview_set_button(data.index)
  } else if (data.trigger && data.trigger == 'webview_left_button') {
    console.log('webview_right_button')
    appCallBackFuncs.webview_left_button()
  } else if (data.trigger && data.trigger == 'webview_closed') {
    console.log('webview_right_button')
    appCallBackFuncs.webview_closed()
  } else if (data.trigger && data.trigger == 'weixin_share') {
    console.log('webview_right_button')
    appCallBackFuncs.weixin_share(data.type)
  }
}
//登录
function login () {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('login').then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}

//登出
function logout () {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('logout').then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//获取token
function getToken () {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('getToken').then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//路由跳转
/**
 * 具体请查看app交互文档
 * @param {
 * //可选值
 * h5,//普通H5
 * final_h5,//没有返回，右上角完成的H5
 * full_h5,//全屏H5
 * home,//首页
 * mid,//中间tabbar页
 * mine,//我的
 * scan//扫码
 * } flag
 * @param {
 * url,//页面地址
 * login,//是否需要登录
 * needRefresh,//返回到这个页面时，1:需要刷新
 * needPartRefresh,//返回到这个页面时，1:需要执行trigger：part_reload
 * pullRefresh,//当前页面，1:需要开启下拉刷新
 * backToFirst,//当前页面，1:点击左上角，返回到入口第一个webview
 * forbidSwipeBack,//当前页面，1:禁止右滑返回
 * title,//	不传取页面title
 * } extra
 */
function bridge (flag, extra = {}) {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('bridge', {
      'flag': flag,
      'extra': extra
    }).then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
/**
 * 页面返回
 * @param {
 * //可选值
 * 0：否，1：是
 * } refresh 
 * @param {回退页面数,不传默认回退1级} index
 */
function goBack (refresh, index) {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('goBack', {
      'refresh': refresh,
      'index': index
    }).then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//右上角按钮组
//数组
//从右往左排列
/**
 * route参数参见路由跳转参数说明
 * @param {{
"img":"右上角图标url",
"title":"设置",
"subBtns":[
{"img":"图片url",
"title":"按钮1",
trigger:function,点击后触发事件
"route":"{ \"flag\" : \"h5\" , \"extra\" : {\"url\":\"https:\/\/www.juejin.im\"} }"},

{"img":"图片url",
"title":"按钮2",
trigger:function,点击后触发事件
"route":"{ \"flag\" : \"h5\" , \"extra\" : {\"url\":\"https:\/\/www.baidu.com\"} }"}
]
}} btns
 */
function setSetButtons ({ img, title, titleColor, subBtns = [] }) {
  window.EWebBridge.webCallAppInJs('webview_set_button', {
    img,
    title,
    titleColor,
    subBtns
  })
  appCallBackFuncs.webview_set_button = function (index) {
    console.log(index)
    if (subBtns[index] && validator.isFunction(subBtns[index].trigger)) {
      subBtns[index].trigger()
    }
  }
}
//右上角按钮的设置
/**
 *route参数参见路由跳转参数说明
 * @param {
  'img':'图片url',
  'title':'按钮文案',
  trigger:function 点击后触发事件
   "route":"{ "flag" : "" , "extra" : {} }"
}
 */
function setRightButton ({ img, title, titleColor, route, trigger }) {
  window.EWebBridge.webCallAppInJs('webview_right_button', {
    img, title, titleColor, route
  })
  appCallBackFuncs.webview_right_button = function () {
    console.log('setRightButton')
    if (validator.isFunction(trigger)) {
      trigger()
    }
  }
}
//左上角按钮的设置
/**
 * @param {
  'img':'图片url',
  'title':'按钮文案'，
  trigger:function 点击后触发事件
   "intercept":"1"   //是否拦截原生返回事件 1是 其他否
} btn
 */
function setLeftButton ({ img, title, titleColor, intercept, trigger }) {
  window.EWebBridge.webCallAppInJs('webview_left_button', {
    img, title, titleColor, intercept
  })
  appCallBackFuncs.webview_left_button = function () {
    console.log('setLeftButton')
    if (validator.isFunction(trigger)) {
      trigger()
    }
  }
}
//导航栏颜色
/**
 * @param {*} barColor 
 * @param {*} titleColor 
 */
function setNavigationColor (barColor, titleColor) {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('navigation_color', {
      'bar_color': barColor,
      'title_color': titleColor
    }).then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//调用手机系统功能
/**
 * 
 * @param {//tel: 打电话，sms: 发短信} system
 * @param {手机号} number 
 */
function callSystem (system, number) {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('callSystem', {
      'system': system, //tel: 打电话，sms: 发短信
      'number': number
    }).then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//埋点统计
/**
 * 
 * @param {*} event 事件名称
 * @param {*} label 事件标签
 * @param {* url,//页面地址
 * login,//是否需要登录
 * needRefresh,//返回到这个页面时，1:需要刷新
 * needPartRefresh,//返回到这个页面时，1:需要执行trigger：part_reload
 * pullRefresh,//当前页面，1:需要开启下拉刷新
 * backToFirst,//当前页面，1:点击左上角，返回到入口第一个webview
 * forbidSwipeBack,//当前页面，1:禁止右滑返回
 * title,//	不传取页面title
 * } extra
 */
function track (event, label, extra = {}) {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('track', {
      'event': event,
      'label': label,
      'extra': extra
    }).then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//iOS 应用内评价
function appstoreRating () {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('appstore_rating').then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//检查app版本更新
function appupdate () {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('app_update').then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//获取当前位置
function getLocation () {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('getLocation').then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//更新当前位置
function refreshLocation () {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('refreshLocation').then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
//分享
/**
 * 
 * @param {*分享标题} title
 * @param {*分享内容} content
 * @param {*分享连接} url
 * @param {*小图} img
 * @param {*分享类型：链接0，图片1} shareType
 * @param {*分享图片} base64
 */
function share ({ title, content, url, img, shareType, base64 }) {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('share', {
      'title': title,
      'content': content,
      'url': url,
      'img': img,
      'shareType': shareType,
      'base64': base64
    })
    appCallBackFuncs.weixin_share = function (type) {
      resolve(JSON.parse(type))
    }
  })
}
//提示框
/**
 * 
 * @param {*内容} content 
 */
function toast (content) {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('webview_toast', { 'content': content }).then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
/**
 * 获取手机型号
 */
function getDeviceModel () {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('getDeviceModel').then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
/**
 * 微信支付
 */
function wxPay ({
  partnerid,
  prepayid,
  noncestr,
  timestamp,
  sign }) {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('wx_pay', {
      partnerid,
      prepayid,
      noncestr,
      timestamp,
      sign
    }).then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
/**
 * 微信支付
 */
function aliPay ({ orderStr }) {
  return new Promise((resolve, reject) => {
    window.EWebBridge.webCallAppInJs('ali_pay', { orderStr }).then(res => {
      resolve(JSON.parse(res))
    }).catch(e => {
      reject(e)
    })
  })
}
/**
 * 
 * @param {取消登录，登录页面取消按钮点击事件} trigger 
 */
function loginCancel (trigger) {
  window.EWebBridge.webCallAppInJs('login_cancel')
  appCallBackFuncs.login_cancel = function () {
    console.log('loginCancel')
    if (validator.isFunction(trigger)) {
      trigger()
    }
  }
}
/**
 * 
 * @param {设置页面标题} param0 
 */
function webviewTitle ({ title }) {
  window.EWebBridge.webCallAppInJs('webview_title', { title })
}

export default {
  login,
  logout,
  getToken,
  bridge,
  goBack,
  setSetButtons,
  setRightButton,
  setLeftButton,
  setNavigationColor,
  callSystem,
  track,
  appstoreRating,
  appupdate,
  getLocation,
  refreshLocation,
  share,
  toast,
  getDeviceModel,
  aliPay,
  wxPay,
  loginCancel,
  webviewTitle
}