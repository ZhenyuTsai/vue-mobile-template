/* eslint-disable */
import store from '@/store'
import { validator } from '@/utils/common'
import $customer from '@/api/customer'
let wxSignParams = {
  signUrl: window.location.href,
  // signUrl: 'http://dat-m.my1000.cn/',
  configParams: {
    timestamp: '',
    nonceStr: '',
    signature: '',
  },
  agentConfigParams: {
    timestamp: '',
    nonceStr: '',
    signature: '',
  },
  errorCount: 3
}
let wxwork = window.wx
async function init (params) {
  wxSignParams.signUrl = window.location.href
  if (validator.isEmpty(store.getters.getVisitType) && store.getters.getVisitType == 'wxwork') {
    let epSign = await $customer.wxworkSign({
      publicPlatformType: process.env.VUE_APP_WXWORK_PPFTYPE,
      system: 'gh',
      shareUrl: wxSignParams.signUrl,
      needType: 'enterprise'
    })
    let appSign = await $customer.wxworkSign({
      publicPlatformType: process.env.VUE_APP_WXWORK_PPFTYPE,
      system: 'gh',
      shareUrl: wxSignParams.signUrl,
      needType: 'apply'
    })
    wxSignParams.configParams.timestamp = epSign.timestamp
    wxSignParams.configParams.nonceStr = epSign.nonceStr
    wxSignParams.configParams.signature = epSign.signature
    wxSignParams.agentConfigParams.timestamp = appSign.timestamp
    wxSignParams.agentConfigParams.nonceStr = appSign.nonceStr
    wxSignParams.agentConfigParams.signature = appSign.signature
    console.log('企业微信初始化')
    console.log(store.getters.getType)
    console.log(wxSignParams)

    setTimeout(() => {
      wxwork = window.wx
      wxConfig(params)
    }, 1000)
  }
}
/**
 * 注入企业身份与权限
 */
function wxConfig (params) {
  console.log('config')
  wxwork.config({
    beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: process.env.VUE_APP_WXWORK_APPID, // 必填，企业微信的corpID
    timestamp: wxSignParams.configParams.timestamp, // 必填，生成签名的时间戳
    nonceStr: wxSignParams.configParams.nonceStr, // 必填，生成签名的随机串
    signature: wxSignParams.configParams.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
    jsApiList: params.apiList // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
  })
  wxwork.error(function (res) {
    console.log('configError')
    console.log(res)
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    if (wxSignParams.errorCount >= 0) {
      wxSignParams.errorCount = wxSignParams.errorCount - 1
      wxSignParams.signUrl = window.location.href
      init(params)
    }
  })
}
/**
 * 注入应用身份与权限
 * 仅部分接口才需要调用agentConfig，需注意每个接口的说明
 */
function wxAgentConfig (api) {
  console.log('######################')
  console.log(wxSignParams)
  console.log('######################')
  return new Promise(resole => {
    wxwork.agentConfig({
      corpid: process.env.VUE_APP_WXWORK_APPID, // 必填，企业微信的corpid，必须与当前登录的企业一致
      agentid: process.env.VUE_APP_WXWORK_AGENTID, // 必填，企业微信的应用id
      timestamp: wxSignParams.agentConfigParams.timestamp, // 必填，生成签名的时间戳
      nonceStr: wxSignParams.agentConfigParams.nonceStr, // 必填，生成签名的随机串
      signature: wxSignParams.agentConfigParams.signature,// 必填，签名，见附录-JS-SDK使用权限签名算法
      jsApiList: [api], //必填
      success: function (res) {
        console.log('agentConfig:success')
        console.log(res)
        resole({
          code: 0,
          msg: null
        })
      },
      fail: function (res) {
        console.log('agentConfig:fail')
        console.log(res)
        if (res.errMsg.indexOf('function not exist') > -1) {
          resole({
            code: 1,
            msg: '版本过低请升级'
          })
        } else {
          resole({
            code: 1,
            msg: '初始化应用错误'
          })
        }
      }
    })
  })
}
/**
 * 检查是否支持当前api
 */
function checkJsApi (api) {
  return new Promise(resole => {
    wxwork.checkJsApi({
      jsApiList: [api],
      success: function (res) {
        console.log('checkJsApi:success')
        console.log(res)
        if (res && res.checkResult[api]) {
          resole({
            code: 0,
            content: null,
            msg: null
          })
        } else {
          resole({
            code: 1,
            content: null,
            msg: '当前客户端版本不支持该接口'
          })
        }
      }
    })
  })
}
/**
 * 接口鉴权
 * 校验接口是否支持，注入企业应用权限
 */
async function authApi (api, isAgentConfig) {
  let result = null
  let checkResult = await checkJsApi(api)
  result = checkResult
  // if (result.errMsg == 'checkJsApi:ok' && result.checkResult[api]) {

  // }
  if (isAgentConfig) {
    let agentConfigResult = await wxAgentConfig(api)
    result = agentConfigResult
  }
  console.log('authApi')
  console.log(result)
  return new Promise(resole => {
    resole(result)
  })
}
/**
 * 企业微信选人接口
 */
function selectEnterpriseContact (
  fromDepartmentId = -1,
  mode = 'multi',
  type = ['department', 'user'],
  selectedDepartmentIds = [],
  selectedUserIds = []
) {
  return new Promise((resole) => {
    wxwork.ready(function () {
      authApi('selectEnterpriseContact', false).then(authResult => {
        if (authResult.code == 0) {
          wxwork.invoke('selectEnterpriseContact', {
            'fromDepartmentId': fromDepartmentId,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
            'mode': mode,// 必填，选择模式，single表示单选，multi表示多选
            'type': type,// 必填，选择限制类型，指定department、user中的一个或者多个
            'selectedDepartmentIds': selectedDepartmentIds,// 非必填，已选部门ID列表。用于多次选人时可重入，single模式下请勿填入多个id
            'selectedUserIds': selectedUserIds// 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
          }, function (res) {
            if (res.err_msg == 'selectEnterpriseContact:ok') {
              if (typeof res.result == 'string') {
                res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
              }
              resole({
                code: 0,
                content: {
                  departmentList: res.result.departmentList,// 已选的部门列表
                  userList: res.result.userList// 已选的成员列表
                },
                msg: null
              })
            } else if (res.err_msg == 'selectEnterpriseContact:cancel') {
              console.log(res)
              resole({
                code: 1,
                content: null,
                msg: '取消通讯录选人'
              })
            } else {
              console.log(res)
              resole({
                code: 1,
                content: null,
                msg: '通讯录选人接口异常'
              })
            }
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}

/**
 * 打开个人信息页
 */
function openUserProfile (type = 1, userid) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('openUserProfile', true).then(authResult => {
        if (authResult.code == 0) {
          wxwork.invoke('openUserProfile', {
            'type': type, //1表示该userid是企业成员，2表示该userid是外部联系人
            'userid': userid //可以是企业成员，也可以是外部联系人
          }, function (res) {
            if (res.err_msg != 'openUserProfile:ok') {
              resole({
                code: 1,
                content: null,
                msg: '打开个人信息页接口异常'
              })
              return
            }
            resole({
              code: 0,
              content: null,
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}

/**
 * 外部选人接口
 */
function selectExternalContact () {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('selectExternalContact', true).then(authResult => {
        if (authResult.code == 0) {
          wxwork.invoke('selectExternalContact', {
            'filterType': 0, //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
          }, function (res) {
            if (res.err_msg != 'selectExternalContact:ok') {
              resole({
                code: 1,
                content: null,
                msg: null
              })
              return
            }
            resole({
              code: 0,
              content: { userIds: res.userIds },
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 获取当前外部联系人userd接口
 */
function getCurExternalContact () {
  return new Promise(resole => {
    console.log('getCurExternalContact111')
    wxwork.ready(function () {
      console.log('getCurExternalContact222')
      authApi('getCurExternalContact', true).then(authResult => {
        if (authResult.code == 0) {
          wxwork.invoke('getCurExternalContact', {
          }, function (res) {
            if (res.err_msg != 'getCurExternalContact:ok') {
              resole({
                code: 1,
                content: null,
                msg: null
              })
              return
            }
            resole({
              code: 0,
              content: { userId: res.userId },
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 获取当前客户群的qunID
 */
function getCurExternalChat () {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('getCurExternalChat', true).then(authResult => {
        if (authResult.code == 0) {
          wxwork.invoke('getCurExternalChat', {
          }, function (res) {
            if (res.err_msg != 'getCurExternalChat:ok') {
              resole({
                code: 1,
                content: null,
                msg: null
              })
              return
            }
            resole({
              code: 0,
              content: { chatId: res.chatId },
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}

/**
 * 聊天工具栏分享消息到会话
 */
function sendChatMessage (params) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('sendChatMessage', true).then(authResult => {
        if (authResult.code == 0) {
          console.log('调用会话')
          wxwork.invoke('sendChatMessage', params, function (res) {
            console.log('发送消息')
            console.log(res)
            if (res.err_msg != 'sendChatMessage:ok') {
              resole({
                code: 1,
                content: null,
                msg: null
              })
              return
            }
            resole({
              code: 0,
              content: null,
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 创建会话接口
 */
function openEnterpriseChat (userIds, externalUserIds, groupName) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('sendChatMessage', false).then(authResult => {
        if (authResult.code == 0) {
          wxwork.openEnterpriseChat({
            // 注意：userIds和externalUserIds至少选填一个，且userIds+externalUserIds总数不能超过2000。
            userIds: userIds,    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
            externalUserIds: externalUserIds, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
            groupName: groupName,  // 必填，会话名称。单聊时该参数传入空字符串""即可。
            success: function () {
              resole({
                code: 0,
                content: null,
                msg: null
              })
            },
            fail: function (res) {
              if (res.errMsg.indexOf('function not exist') > -1) {
                resole({
                  code: 1,
                  content: null,
                  msg: '版本过低请升级'
                })
              }
              resole({
                code: 1,
                content: null,
                msg: null
              })
            }
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 获取“转发”按钮点击状态及自定义分享内容接口
 */
function onMenuShareAppMessage (title, desc, link, imgUrl) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('onMenuShareAppMessage', false).then(authResult => {
        if (authResult.code == 0) {
          wxwork.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接；在微信上分享时，该链接的域名必须与企业某个应用的可信域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
              resole({
                code: 0,
                content: {
                  state: 'success'
                },
                msg: null
              })
            },
            cancel: function () {
              resole({
                code: 0,
                content: {
                  state: 'cancel'
                },
                msg: null
              })
            }
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 获取“微信”按钮点击状态及自定义分享内容接口
 */
function onMenuShareWechat (title, desc, link, imgUrl) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('onMenuShareWechat', false).then(authResult => {
        if (authResult.code == 0) {
          wxwork.onMenuShareWechat({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
              resole({
                code: 0,
                content: {
                  state: 'success'
                },
                msg: null
              })
            },
            cancel: function () {
              resole({
                code: 0,
                content: {
                  state: 'cancel'
                },
                msg: null
              })
            }
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}

/**
 * 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
 */
function onMenuShareTimeline (title, link, imgUrl) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('onMenuShareTimeline', false).then(authResult => {
        if (authResult.code == 0) {
          wxwork.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接；在微信上分享时，该链接的域名必须与企业某个应用的可信域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
              resole({
                code: 0,
                content: {
                  state: 'success'
                },
                msg: null
              })
            },
            cancel: function () {
              resole({
                code: 0,
                content: {
                  state: 'cancel'
                },
                msg: null
              })
            }
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}

/**
 * 自定义转发到会话
 */
function shareAppMessage (title, desc, link, imgUrl) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('shareAppMessage', false).then(authResult => {
        if (authResult.code == 0) {
          wxwork.invoke('shareAppMessage', {
            title: title, // 消息的标题
            desc: desc, // 消息的描述
            link: link, // 消息链接
            imgUrl: imgUrl // 消息封面
          }, function (res) {
            if (res.err_msg != 'shareAppMessage:ok') {
              resole({
                code: 1,
                content: null,
                msg: null
              })
              return
            }
            resole({
              code: 0,
              content: null,
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}

/**
 * 自定义转发到微信
 */
function shareWechatMessage (title, desc, link, imgUrl) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('shareWechatMessage', false).then(authResult => {
        if (authResult.code == 0) {
          wxwork.invoke('shareWechatMessage', {
            title: title, // 消息的标题
            desc: desc, // 消息的描述
            link: link, // 消息链接
            imgUrl: imgUrl // 消息封面
          }, function (res) {
            if (res.err_msg != 'shareWechatMessage:ok') {
              resole({
                code: 1,
                content: null,
                msg: null
              })
              return
            }
            resole({
              code: 0,
              content: null,
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 将H5页面通过个人群发发送给客户
 */
function shareToExternalContact (title, desc, link, imgUrl) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('shareToExternalContact', true).then(authResult => {
        if (authResult.code == 0) {
          wxwork.invoke('shareToExternalContact', {
            title: title, // 消息的标题
            desc: desc, // 消息的描述
            link: link, // 消息链接
            imgUrl: imgUrl // 消息封面
          }, function (res) {
            if (res.err_msg != 'shareToExternalContact:ok') {
              resole({
                code: 1,
                content: null,
                msg: null
              })
              return
            }
            resole({
              code: 0,
              content: null,
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 将H5页面通过群发助手发送给客户群
 */
function shareToExternalChat (title, desc, link, imgUrl) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('shareToExternalChat', true).then(authResult => {
        if (authResult.code == 0) {
          wxwork.invoke('shareToExternalChat', {
            title: title, // 消息的标题
            desc: desc, // 消息的描述
            link: link, // 消息链接
            imgUrl: imgUrl // 消息封面
          }, function (res) {
            if (res.err_msg != 'shareToExternalChat:ok') {
              resole({
                code: 1,
                content: null,
                msg: null
              })
              return
            }
            resole({
              code: 0,
              content: null,
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 监听页面返回事件
 * false表示中断此次返回操作，否则继续执行返回操作
 */
function onHistoryBack (callBack = function () { return true }) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('onHistoryBack', false).then(authResult => {
        if (authResult.code == 0) {
          wxwork.onHistoryBack(function () {
            let flag = callBack()
            resole({
              code: 0,
              content: null,
              msg: null
            })
            return flag
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 隐藏右上角菜单接口
 */
function hideOptionMenu () {
  wxwork.hideOptionMenu()
}
/**
 * 显示右上角菜单接口
 */
function showOptionMenu () {
  wxwork.showOptionMenu()
}
/**
 * 关闭当前网页窗口接口
 */
function closeWindow () {
  wxwork.closeWindow()
}
/**
 * 批量隐藏功能按钮接口
 */
function hideMenuItems (menuList = []) {
  wxwork.hideMenuItems({
    menuList: menuList// 要隐藏的菜单项
  })
}
/**
 * 批量显示功能按钮接口
 */
function showMenuItems (menuList = []) {
  wxwork.showMenuItems({
    menuList: menuList // 要显示的菜单项
  })
}

/**
 * 隐藏所有非基础按钮接口
 */
function hideAllNonBaseMenuItem () {
  wxwork.hideAllNonBaseMenuItem()
}

/**
 * 显示所有功能按钮接口
 */
function showAllNonBaseMenuItem () {
  wxwork.showAllNonBaseMenuItem()
}
/**
 * 打开系统默认浏览器
 */
function openDefaultBrowser (isNeedLogin, redirect_uri = window.location.href, agentid, state) {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('openDefaultBrowser', false).then(authResult => {
        if (authResult.code == 0) {
          let appid = ''
          redirect_uri = encodeURIComponent(redirect_uri)
          let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&agentid=${agentid}&state=${state}#wechat_redirect`
          wxwork.invoke('openDefaultBrowser', {
            'url': isNeedLogin ? url : redirect_uri, // 在默认浏览器打开redirect_uri，并附加code参数；也可以直接指定要打开的url，此时不会附带上code参数。
          }, function (res) {
            if (res.err_msg != 'openDefaultBrowser:ok') {
              resole({
                code: 1,
                content: null,
                msg: null
              })
              return
            }
            resole({
              code: 0,
              content: null,
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}
/**
 * 用户截屏事件
 */
function onUserCaptureScreen () {
  return new Promise(resole => {
    wxwork.ready(function () {
      authApi('onUserCaptureScreen', false).then(authResult => {
        if (authResult.code == 0) {
          wxwork.onUserCaptureScreen(function () {
            resole({
              code: 0,
              content: null,
              msg: null
            })
          })
        } else {
          resole(authResult)
        }
      })
    })
  })
}

export default {
  init,
  selectEnterpriseContact,//通讯录选人接口
  openUserProfile,
  selectExternalContact,
  getCurExternalContact,
  getCurExternalChat,
  sendChatMessage,
  openEnterpriseChat,
  onMenuShareAppMessage,
  onMenuShareWechat,
  onMenuShareTimeline,
  shareAppMessage,
  shareWechatMessage,
  shareToExternalContact,
  shareToExternalChat,
  onHistoryBack,
  hideOptionMenu,
  showOptionMenu,
  closeWindow,
  hideMenuItems,
  showMenuItems,
  hideAllNonBaseMenuItem,
  showAllNonBaseMenuItem,
  openDefaultBrowser,
  onUserCaptureScreen
}
