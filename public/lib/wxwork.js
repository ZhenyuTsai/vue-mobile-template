/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion
 * @Date 2022-01-25 16:27:26
 * @LastEditors ZhenYuTsai
 */
(function (window, document) {
  // 微信js-sdk
  document.getElementById('wxwork') && document.getElementById('wxwork').remove()
  var hm = document.createElement('script')
  hm.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
  hm.id = 'wxwork'
  var s = document.getElementsByTagName('script')[0]
  const ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') !== -1 && ua.indexOf('wxwork') !== -1) {
    s.parentNode.insertBefore(hm, s)
  }
})(window, document)
