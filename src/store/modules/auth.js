import Cookies from 'js-cookie'

const state = {
  token: sessionStorage.getItem('token') || Cookies.get('h5_token') || Cookies.get('token'),
  thirdToken: Cookies.get('h5_third')
}

// getters
const getters = {
  getToken: state => state.token,
  getThirdToken: state => state.thirdToken
}

// actions
const actions = {
  setToken ({ commit }, token) {
    Cookies.set('h5_token', token)
    window.sessionStorage.setItem('token', token)
    commit('SET_TOKEN', { token })
  },
  removeToken ({ commit }) {
    Cookies.remove('h5_token')
    window.sessionStorage.removeItem('token')
    commit('REMOVE_TOKEN')
  },
  setThirdToken ({ commit }, token) {
    Cookies.set('h5_third', token)
    window.sessionStorage.setItem('third', token)
    commit('SET_THIRD_TOKEN', { token })
  },
  removeThirdToken ({ commit }) {
    Cookies.remove('h5_third')
    window.sessionStorage.removeItem('third')
    commit('REMOVE_THIRD_TOKEN')
  }
}

// mutations
const mutations = {
  SET_TOKEN (state, { token }) {
    state.token = token
  },
  REMOVE_TOKEN (state) {
    state.token = null
  },
  SET_THIRD_TOKEN (state, { token }) {
    state.thirdToken = token
  },
  REMOVE_THIRD_TOKEN (state) {
    state.thirdToken = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
