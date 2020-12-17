const state = {
  timestamp: null,
  nonceStr: null,
  signature: null
}

// getters
const getters = {
  getTimestamp: state => state.timestamp,
  getNonceStr: state => state.nonceStr,
  getSignature: state => state.signature
}

// actions
const actions = {
  setSignInfo ({
    commit
  }, { timestamp, nonceStr, signature }) {
    commit('RESET_SIGN_INFO')
    commit('SET_SIGN_INFO', {
      timestamp,
      nonceStr,
      signature
    })
  }
}

// mutations
const mutations = {
  SET_SIGN_INFO (state, {
    timestamp,
    nonceStr,
    signature
  }) {
    state.timestamp = timestamp
    state.nonceStr = nonceStr
    state.signature = signature
  },
  RESET_SIGN_INFO (state) {
    state.timestamp = null
    state.nonceStr = null
    state.signature = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
