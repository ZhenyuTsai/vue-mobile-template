import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const requireModules = require.context('./modules', false, /\.js$/)
const modules = {}
requireModules.keys().forEach(key => {
  if (requireModules(key).name) {
    modules[requireModules(key).name] = requireModules(key).default
  }
})
export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    ...modules
  }
})
