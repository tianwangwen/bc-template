import UserApi from '@/api/user'
import { getToken, setToken, login, clearTabs } from '@/utils/auth'
import router from '@/router'
import { handleTreeToList } from '@/utils/tools'
import { createWatermark } from '@/utils/watermark'

const state = {
  token: getToken(),
  info: {
    id: 12,
    realName: ' '
  },
  menuTree: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_MENU_TREE: (state, payload) => {
    state.menuTree = payload
  },
}

const actions = {
  async login({ commit }, userInfo) {
    const data = await UserApi.login(userInfo)
    if (!data) return
    commit('SET_TOKEN', data)
    setToken(data)
    return data
  },
  async getInfo({ commit }) {
    const data = await UserApi.getInfo()
    if (!data) {
      clearTabs()
      return login()
    }
    createWatermark(data.realName)
    commit('SET_INFO', data)
    window.Sensors.login(data.userId)
  },
  async getMenuTree({ commit }) {
    const data = await UserApi.getMenuTree()
    if (!data) return
    let menus = []
    const { routes } = router.options
    const routesList = handleTreeToList(routes)
    if (data[0] && data[0].value.menuCode === 'DD_STP_ROOT') {
      data[0].children.forEach((permMenu) => {
        let children = []
        const localRoute = routesList.find((item) => item.code === permMenu.value.menuCode) || {}
        permMenu.children.forEach(subMenu => {
          children.push({
            name: subMenu.value.menuName,
            path: subMenu.value.menuUri,
            code: subMenu.value.menuCode,
            meta: { title: subMenu.value.menuName },
          })
        })
        menus.push({
          name: permMenu.value.menuName,
          path: permMenu.value.menuUri || localRoute.path,
          meta: { ...localRoute.meta, title: permMenu.value.menuName, icon: localRoute.meta?.icon },
          code: permMenu.value.menuCode,
          children: [].concat(children),
        })
      })
      commit('SET_MENU_TREE', menus)
    }
    return menus
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
