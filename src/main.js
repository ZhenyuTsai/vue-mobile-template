import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import numeral from 'numeral'
import './assets/base.css'
import 'amfe-flexible'
import VConsole from 'vconsole'
import Minxin from './mixin'
import Middleware from './middleware'
import filters from './filters'
if (process.env.VUE_APP_VCONSOLE === 'on') {
  // eslint-disable-next-line no-unused-vars
  const vConsole = new VConsole()
}
Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.prototype.$numeral = numeral

Vue.use(Minxin)
Vue.use(Middleware, { router })
Vue.use(filters)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
