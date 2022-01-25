/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion 用户信息与鉴权信息
 * @Date 2022-01-21 17:13:57
 * @LastEditors ZhenYuTsai
 */
import Cookies from 'js-cookie'
export const name = 'user'
export default {
  namespaced: false,
  state: () => ({
    token: sessionStorage.getItem('token') || Cookies.get('token'),
    thirdToken: sessionStorage.getItem('third') || Cookies.get('third'),
    userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null
  }),
  mutations: {
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
    },
    SET_USER_INFO (state, { userInfo }) {
      state.userInfo = userInfo
    },
    REMOVE_USER_INFO (state) {
      state = null
    }
  },
  actions: {
    setToken ({ commit }, token) {
      Cookies.set('token', token)
      sessionStorage.setItem('token', token)
      commit('SET_TOKEN', { token })
    },
    removeToken ({ commit }) {
      Cookies.remove('token')
      sessionStorage.removeItem('token')
      commit('REMOVE_TOKEN')
    },
    setThirdToken ({ commit }, token) {
      Cookies.set('third', token)
      sessionStorage.setItem('third', token)
      commit('SET_THIRD_TOKEN', { token })
    },
    removeThirdToken ({ commit }) {
      Cookies.remove('third')
      sessionStorage.removeItem('third')
      commit('REMOVE_THIRD_TOKEN')
    },
    setUserInfo ({ commit }, userInfoObject) {
      const userInfoJson = JSON.stringify(userInfoObject)
      sessionStorage.setItem('userInfo', userInfoJson)
      commit('SET_USER_INFO', { userInfo: userInfoObject })
    },
    removeUserInfo ({ commit }) {
      sessionStorage.removeItem('userInfo')
      commit('REMOVE_USER_INFO')
    }
  },
  getters: {
    getToken (state) {
      return state.token
    },
    getThirdToken (state) {
      return state.thirdToken
    },
    getUserInfo (state) {
      return state.userInfo
    }
  }
}
