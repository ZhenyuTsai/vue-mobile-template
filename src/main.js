import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filter from './filter'
import app from './utils/app'
import FastClick from 'fastclick'
import 'amfe-flexible/index.js'
import 'mand-mobile/lib/mand-mobile.css'
import 'vant/lib/index.css'
import Vant from 'vant'
import { Button } from 'mand-mobile'
Vue.config.productionTip = false
Vue.use(Vant)
Vue.component(Button.name, Button)

// 初始化浏览器类型，设置系统、平台类型参数
store.dispatch('initSystemType')

// 执行全局初始化（APP等）
Vue.prototype.$app = app
app.init()
// 全局过滤处理
filter.doFilters()

// 解决ios移动端input调软键盘问题
FastClick.prototype.focus = function (targetElement) {
  let length
  const isIphone = navigator.userAgent.indexOf('iPhone') !== -1
  if (
    isIphone &&
    targetElement.setSelectionRange &&
    targetElement.type.indexOf('date') !== 0 &&
    targetElement.type !== 'time' &&
    targetElement.type !== 'month' &&
    targetElement.type !== 'email'
  ) {
    length = targetElement.value.length
    targetElement.setSelectionRange(length, length)
    /* 修复bugios11.3不弹出键盘，这里加上聚焦代码，让其强制聚焦弹出键盘 */
    targetElement.focus()
  } else {
    targetElement.focus()
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
