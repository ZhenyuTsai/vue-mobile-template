import CommonUtil from '@/utils/common'
import config from '@/config'

const state = {
  visitType: null,
  domain: null,
  system: null,
  type: null,
  thirdType: null,
  thirdAppId: null,
  appType: null,
  aliminiFlag: false
}

// getters
const getters = {
  getVisitType: state => state.visitType,
  getDomain: state => state.domain,
  getSystem: state => state.system,
  getType: state => state.type,
  getThirdType: state => state.thirdType,
  getThirdAppId: state => state.thirdAppId,
  getAppType: state => state.appType,
  getAliminiFlag: state => state.aliminiFlag
}

// actions
const actions = {
  initSystemType ({ commit }) {
    let visitType = CommonUtil.getUserAgentType()
    const domain = CommonUtil.getDomain()
    let appType, system, type, thirdType, thirdAppId

    if (visitType === 'ios' || visitType === 'android') {
      appType = visitType
      visitType = 'app'
    }
    // 新增与新版app交互
    if (visitType === 'ios_v2' || visitType === 'android_v2') {
      appType = visitType
      visitType = 'app_v2'
    }
    console.log(process.env.VUE_APP_BASEURL)

    // 遍历config.system.params，获取对应的params参数
    for (let i = 0; i < config.system.params.length; i++) {
      const obj = config.system.params[i]
      if (visitType === obj.system_type && domain === obj.domain) {
        system = obj.params.system
        type = obj.params.type
        thirdType = obj.params.thirdType
        thirdAppId = obj.params.appId
      }
    }
    console.log(visitType, appType, domain, system, type, thirdType, thirdAppId)
    // 根据配置初始化浏览器、系统平台类型
    commit('INIT_SYSTEM_TYPE', { visitType, appType, domain, system, type, thirdType, thirdAppId })
  },
  setAliminiFlag ({ commit }, aliminiFlag) {
    commit('SET_ALIMINIFLAG', { aliminiFlag })
  },
  setSystem ({ commit }, system) {
    commit('SET_SYSTEM', { system })
  }
}

// mutations
const mutations = {
  INIT_SYSTEM_TYPE (state, { visitType, appType, domain, system, type, thirdType, thirdAppId }) {
    state.visitType = visitType
    state.domain = domain
    state.system = system
    state.type = type
    state.thirdType = thirdType
    state.thirdAppId = thirdAppId
    state.appType = appType
  },
  SET_ALIMINIFLAG (state, { aliminiFlag }) {
    state.aliminiFlag = aliminiFlag
  },
  SET_SYSTEM (state, { system }) {
    state.system = system
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
