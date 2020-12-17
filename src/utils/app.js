import store from '@/store'
import {
  validator
} from '@/utils/common'
/**
 * 跳转页面pageCode枚举
 */
const PAGE_CODE_ENUM = {
  COMMON_PRIMARY_PAGE: 'COMMON_PRIMARY_PAGE', //通用二级页面
  CUSTOMER_LOGIN: 'CUSTOMER_LOGIN' //登陆页面
}

/**
 * 分享渠道枚举
 */
const SHARE_TYPE_ENUM = {
  WX_FRIEND: 'wx_friend', //微信好友
  WX_SPACE: 'wx_space', //朋友圈
  QQ_FRIEND: 'qq_friend', //qq好友
  QQ_SPACE: 'qq_space', //qq空间
  WB: 'wb', //微博
  MESSAGE: 'message' //短信
}

function init () {
  window.$appBridge = new Object()
}

/**
 * 调用app方法
 */
function callAppFuction (params) {
  console.log('======================callAppFuction=========================')
  console.log(JSON.stringify(params))
  let appType = store.getters.getAppType
  if (appType === 'ios') {
    // window.JSonString(JSON.stringify(params))
    window.webkit.messageHandlers.JSonString.postMessage(params)
  } else if (appType === 'android') {
    window.android.jsCallAndroid(JSON.stringify(params))
  }
}

/**
 * 跳转页面(非异步方法, 无回调， 直接调用即可， 无返回值)
 * @param {
 *        @pageCode： 必传 跳转的页面代码 跳通用二级H5页面 COMMON_PRIMARY_PAGE 原生登陆页 CUSTOMER_LOGIN 其他请看App与H5交互文档参数说明
 *        @url：跳通用二级页面必传 跳特殊pageCode非必传
 *        @naviInit：非必传 初始化目标页面标题栏 参数详见appNaviInit方法参数
 *        @businessData:非必传 最小参数 json
 * } params 
 */
function jumpValue (params={}) {
  if (store.getters.getVisitType != 'app') {
    return
  }
  if (!validator.isEmpty(params)) {
    return
  }
  let callAppParams = {
    'functionName': 'jumpValue',
    'dataObject': params
  }
  callAppFuction(callAppParams)
}

/**
 * 设置标题栏信息
 * @param {
 * *    @setTitle:json对象 非必传 设置标题
 *          @title:必传
 *      @setButton：json对象 非必传 设置自定义按钮
 *          @buttonArrary:必传 array 按钮数组组合
 *              @jsFunction:必传 设置js方法 必须传一个function 设置自定义按钮时每个按钮的js方法
 *              @text:必传 自定义按钮标题
 *              @jsData:非必传 H5携带参数 app回调js传入的参数
 *              @imgUrl:非必传 按钮图标地址
 *      @setGoback:非必传 json对象 设置回退键是否显示 不传默认可见
 *              visibility:必传 bool值 
 *      @setVisible:非必传 设置导航栏是否可见 不传默认可见
 *          @visibility:必传 bool
 *      @setClose:非必传 string 1：显示 0：不显示 用于特殊返回 直接结束该导航页面
 *      @setJsFinish:非必传 通知app  js加载完成
 * } params 
 */
function naviInit (params={}) {
  return new Promise((resolve, reject) => {
    if (store.getters.getVisitType != 'app') {
      reject()
    }
    if (!validator.isEmpty(params)) {
      reject()
    }
    window.$appBridge = Object.assign(window.$appBridge, {
      'naviInit': {
        'resolve': resolve
      }
    })
    params.setFunction = {
      jsFunction: '$appBridge.naviInit.resolve'
    }
    //置空回调方法集
    window.$appBridge.naviInit.buttonCallBack = []
    //设置每个按钮的回调方法
    if (validator.isEmpty(params.setButton) && validator.isEmpty(params.setButton.buttonArrary) && validator.isArray(params.setButton.buttonArrary)) {
      for (let i = 0; i < params.setButton.buttonArrary.length; i++) {
        let button = params.setButton.buttonArrary[i]
        window.$appBridge.naviInit.buttonCallBack[i] = button.jsFunction
        params.setButton.buttonArrary[i] =  {
          jsFunction: `$appBridge.naviInit.buttonCallBack[${i}]`,
          text: button.text,
          // imgUrl: imgurl,
          // jsData: jsdata
        }
      }
    }

    let callAppParams = {
      'functionName': 'naviInit',
      'dataObject': params
    }
    callAppFuction(callAppParams)
  })
}
/**
 * 设置分享信息
 * @param {
 *      @shareChannel {必传 array 分享渠道 支持多个渠道
 *          @type： 分享渠道类型 详见App与H5交互文档参数说明文档
 *          @shareType: 分享方式 详见App与H5交互文档参数说明文档
 *          @imgHref：配置弹出分享按钮图标
 *          @url：分享链接
 *          @image：配置分享后图标，分享的内容图片
 *          @title：分享内容的标题
 *          @description：分享内容摘要
 *          @text：分享内容的文本信息
 *          @btnTitle：分享渠道名称，不传不显示名称
 *      }
 * } params 
 */
function share (params={}) {
  if (store.getters.getVisitType != 'app') {
    return
  }
  if (!validator.isEmpty(params)) {
    return
  }
  let callAppParams = {
    'functionName': 'share',
    'dataObject': params
  }
  callAppFuction(callAppParams)
}
/**
 * 获取token方法
 * @return {
 *  @token 如果获取到Token则返回，否则为空字符串
 * }
 */
function getToken () {
  return new Promise((resolve, reject) => {
    console.log(store.getters.getVisitType)

    if (store.getters.getVisitType != 'app') {
      reject()
    }
    let params = {}
    window.$appBridge = Object.assign(window.$appBridge, {
      'getToken': {
        'resolve': resolve
      }
    })
    params.jsFunction = '$appBridge.getToken.resolve'
    let callAppParams = {
      'functionName': 'getToken',
      'dataObject': params
    }
    callAppFuction(callAppParams)
  })
}
/**
 * 上传图片
 * @param {
 *      @jsData： 非必传 js携带参数,
 *      @count: 必传 int 上传图片数 默认9张 在sourceType是相机时默认为1,
 *      @sizeType：必传 int 上传图片大小,
 *      @sourceType:必传 array 图片来源类型 类型有且仅有  “相册”、”相机”两种渠道
 * } params 
 */
function verifyIdentity (params={}) {
  return new Promise((resolve, reject) => {
    if (store.getters.getVisitType != 'app') {
      reject()
    }
    if (!validator.isEmpty(params)) {
      reject()
    }
    window.$appBridge = Object.assign(window.$appBridge, {
      'verifyIdentity': {
        'resolve': resolve
      }
    })
    params.jsFunction = '$appBridge.verifyIdentity.resolve'
    let callAppParams = {
      'functionName': 'verifyIdentity',
      'dataObject': params
    }
    callAppFuction(callAppParams)
  })

}

/**
 * 通过外部浏览器打开网页
 * @param {
 *      @url:必传 需要打开页面的url 需要完整的链接
 * } params
 */
function outBrowser (params={}) {
  if (store.getters.getVisitType != 'app') {
    return
  }
  if (!validator.isEmpty(params)) {
    return
  }
  let callAppParams = {
    'functionName': 'outBrowser',
    'dataObject': params
  }
  callAppFuction(callAppParams)
}

/**
 * 微信支付
 * @param {
 *      @jsFunction:必传 app支付完回调H5的方法
 *      @businessData:
 *                  @appid：必传 应用appid
 *                  @partnerid：必传 商户号
 *                  @prepayid：必传 微信返回的支付交易会话id
 *                  @noncestr：必传 随机字符串
 *                  @sign：必传 签名
 * ·····@jsData：非必传
 * } params 
 * @returns {
 *      @wxPayResult:必传 支付结果 0-成功 1-失败  2-取消
 * } return app回调js方法参数
 */
function wxPayment (params={}) {
  return new Promise((resolve, reject) => {
    if (store.getters.getVisitType != 'app') {
      reject()
    }
    if (!validator.isEmpty(params)) {
      reject()
    }
    window.$appBridge = Object.assign(window.$appBridge, {
      'wxPayment': {
        'resolve': resolve
      }
    })
    params.jsFunction = '$appBridge.wxPayment.resolve'
    let callAppParams = {
      'functionName': 'wxPayment',
      'dataObject': params
    }
    callAppFuction(callAppParams)
  })
}
/**
 * webview后退
 */
function back () {
  if (store.getters.getVisitType != 'app') {
    return
  }
  let callAppParams = {
    'functionName': 'back'
  }
  callAppFuction(callAppParams)
}
/**
 * app页面后退
 */
function popView () {
  if (store.getters.getVisitType != 'app') {
    return
  }
  let callAppParams = {
    'functionName': 'popView'
  }
  callAppFuction(callAppParams)
}

/**
 * 获取手机信息
 * @param {
 *      @jsFunction: 必传 app支付完回调H5的方法
 *      @jsData： 非必传
 *      @getSystemKey: 非必传 获取info关键字 不传时获取全部信息 支持locationInfo， systemType， uuid
 * } params 
 * 
 * @returns {
 *      @locationInfo：非必传 地理位置信息 json对象
 *            @longitude：非必传 经度
 *            @latitude：非必传 维度
 *      @systemType：非必传 系统名称 
 *      @uuid：非必传 手机唯一编号
 *      @version：非必传 当前版本
 *      @ip：非必传 当前ip地址（ipv4）
 * }
 */
function systemInfo (params={}) {
  return new Promise((resolve, reject) => {
    if (store.getters.getVisitType != 'app') {
      reject()
    }
    window.$appBridge = Object.assign(window.$appBridge, {
      'systemInfo': {
        'resolve': resolve
      }
    })
    params.jsFunction = '$appBridge.systemInfo.resolve'
    let callAppParams = {
      'functionName': 'systemInfo',
      'dataObject': params
    }
    callAppFuction(callAppParams)
  })

}

/**
 * 支付宝支付
 * @param {
 *      @jsFunction: 必传 app支付完回调H5的方法
 *      @jsData： 非必传
 *      @businessData:必传
 *              @orderStr：必传调起支付宝sdk参数字符串
 * } params 
 */
function Alipay (params) {
  return new Promise((resolve, reject) => {
    if (store.getters.getVisitType != 'app') {
      reject()
    }
    if (!validator.isEmpty(params)) {
      reject()
    }
    window.$appBridge = Object.assign(window.$appBridge, {
      'Alipay': {
        'resolve': resolve
      }
    })
    params.jsFunction = '$appBridge.Alipay.resolve'
    let callAppParams = {
      'functionName': 'Alipay',
      'dataObject': params
    }
    callAppFuction(callAppParams)
  })
}

export default {
  PAGE_CODE_ENUM,
  SHARE_TYPE_ENUM,
  init,
  jumpValue,
  naviInit,
  share,
  getToken,
  verifyIdentity,
  outBrowser,
  wxPayment,
  back,
  popView,
  systemInfo,
  Alipay
}