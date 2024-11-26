const state = {
  sidebarOpened: true,
  notifyNum: 0,
  scrollList: {}, // 记录页面滚动条
}

const mutations = {
  setSidebarOpened(state, payload) {
    state.sidebarOpened = payload
  },
  setNotifyNum(state, payload) {
    state.notifyNum = payload
  },
  setScrollList(state, payload) {
    state.scrollList[payload.name] = payload.value
  },
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
