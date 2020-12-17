const state = {
  globalMaskShow: false, // 全局遮罩
  lodingShow: false, // 加载遮罩
  title: ''
}

// getters
const getters = {
  getGlobalMaskShow: state => state.globalMaskShow,
  getLodingShow: state => state.lodingShow,
  getTitle: state => state.title
}

// actions
const actions = {

}

// mutations
const mutations = {
  GLOBALMASK_OPEN (state) {
    state.globalMaskShow = true
  },
  GLOBALMASK_CLOSE (state) {
    state.globalMaskShow = false
  },
  GLOBALLODING_OPEN () {
    state.lodingShow = true
  },
  GLOBALLODING_CLOSE () {
    state.lodingShow = false
  },
  SET_TITLE (state, { title }) {
    state.title = title
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
