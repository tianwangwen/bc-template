import UserApi from '@/api/user'
import { getToken, login, removeToken } from '@/utils/auth'
import router from '@/router'
import { handleTreeToList } from '@/utils/tools'
import { createWatermark } from '@/utils/watermark'
import dayjs from 'dayjs'

const state = {
  token: getToken(),
  info: {
    id: null,
    mediationCenterId: null,
    permissions: []
  },
  menuLoad: false,
  menuTree: [],
  perms: []
}

const mutations = {
  SET_INFO: (state, info) => {
    state.info = { ...state.info, ...info }
  },
  SET_MENU_LOAD: (state, payload) => {
    state.menuLoad = payload
  },
  SET_MENU_TREE: (state, payload) => {
    state.menuTree = payload
  },
  SET_PERMS: (state, payload) => {
    state.perms = payload
  }
}

const actions = {
  async getInfo({ commit, dispatch }) {
    const data = await UserApi.getInfo()
    if (!data) {
      removeToken()
      return login()
    }
    createWatermark(data.userCode + dayjs().format('YYYY/MM/DD'))
    await commit('SET_INFO', data)
  },
  async getUserMenu({ commit }) {
    const { id, mediationCenterId } = state.info
    const data = await UserApi.queryUserMenu({ mediateCenterId: mediationCenterId, systemUserId: id })
    if (!data) return

    const menus = []
    const perms = []
    const { routes } = router.options
    const routesList = handleTreeToList(routes)
    if (data[0] && data[0].menuCode === 'HRM_ROOT') {
      data[0].children.forEach(permMenu => {
        const children = []
        ;(permMenu.children || []).forEach(subMenu => {
          const innerLocalRoute = routesList.find(item => item.meta?.code === subMenu.menuCode) || {}
          children.push({
            name: subMenu.menuName,
            path: subMenu.menuUri || innerLocalRoute.path,
            meta: { title: subMenu.menuName, code: subMenu.menuCode }
          })
          perms.push(subMenu.menuCode)
        })

        const localRoute = routesList.find(item => item.meta?.code === permMenu.menuCode) || {}
        menus.push({
          name: permMenu.menuName,
          path: permMenu.menuUri || localRoute.path,
          meta: { ...localRoute.meta, title: permMenu.menuName, code: permMenu.menuCode, icon: localRoute.meta?.icon },
          children: [].concat(children)
        })
        perms.push(permMenu.menuCode)
      })
      commit('SET_MENU_LOAD', true)
      commit('SET_MENU_TREE', menus)
      commit('SET_PERMS', perms)
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
