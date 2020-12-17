/**
 * 系统配置，会将系统类型、平台类型、三方类型、三方id存在store中
 * 各系统使用时请自行更改为相应系统的配置
 */
const params = [{
  system_type: 'wx',
  domain: process.env.VUE_APP_BASEURL,
  params: {
    type: 'wx',
    system: 'yq',
    thirdType: 'yqwx2',
    appId: process.env.VUE_APP_WX_APPID
  }
}, {
  system_type: 'wxwork',
  domain: process.env.VUE_APP_BASEURL,
  params: {
    type: 'cc_chat',
    system: '',
    thirdType: 'wxwork',
    appId: process.env.VUE_APP_WXWORK_APPID
  }
},
{
  system_type: 'app',
  domain: process.env.VUE_APP_BASEURL,
  params: {
    type: 'app',
    system: 'yq',
    thirdType: '',
    appId: ''
  }
},
{
  system_type: 'page',
  domain: process.env.VUE_APP_BASEURL,
  params: {
    type: 'page',
    system: 'yq',
    thirdType: '',
    appId: ''
  }
},
{ system_type: 'alipay', domain: process.env.VUE_APP_BASEURL, params: { type: 'alipay', system: 'hr', thirdType: 'alipay', appId: process.env.VUE_APP_ALIPAY_APPID } }
]

export default {
  params
}
