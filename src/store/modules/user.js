
const state = {
  nickName: null,
  imgUrl: null,
  userCode: '',//企业微信客服工号
  userName: '',//企业微信用户姓名
  organCode: '',//企业微信机构编码
}

// getters
const getters = {
  getImgUrl: state => state.imgUrl,
  getNickName: state => state.nickName,
  getUserCode: state => state.userCode,
  getUserName: state => state.userName,
  getOrganCode: state => state.organCode,
}

// actions
const actions = {
  setThirdInfo ({ commit }, { nickName, imgUrl, userCode, userName, organCode }) {
    commit('SET_THIRD_INFO', { nickName, imgUrl, userCode, userName, organCode })
  }
}

// mutations
const mutations = {
  SET_THIRD_INFO (state, { nickName, imgUrl, userCode, userName, organCode }) {
    state.nickName = nickName
    state.imgUrl = imgUrl
    state.userCode = userCode
    state.userName = userName
    state.organCode = organCode
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
