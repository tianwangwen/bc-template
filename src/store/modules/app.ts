import CaseApi from '@/api/case'

const state = {
  messageNum: 0,
  scrollList: {},
  chatNum: 0,
  chatVisible: false,
  chatObj: null,
  warningNum: 0
}

const mutations = {
  setMessageNum(state, payload) {
    state.messageNum = payload
  },
  setScrollList(state, payload) {
    state.scrollList[payload.name] = payload.value
  },
  setChatNum(state, payload) {
    state.chatNum = payload
  },
  setChatVisible(state, payload) {
    state.chatVisible = payload
  },
  setChatObj(state, payload) {
    state.chatObj = payload
  },
  setWarningNum(state, payload) {
    state.warningNum = payload
  }
}

let stoId = null

const actions = {
  async getWarningNum({ commit, dispatch }) {
    if (stoId) {
      clearTimeout(stoId)
      stoId = null
    }
    const data = await CaseApi.queryWarningRecordsCount({})
    stoId = setTimeout(() => {
      dispatch('getWarningNum')
    }, 10000)
    if (!data) return
    await commit('setWarningNum', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
