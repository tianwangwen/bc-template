import Cookies from 'js-cookie'


export const tokenKey = 'ddstpToken'
const TABSKEY = 'ddstp'

export function getToken() {
  return Cookies.get(tokenKey)
}

export function setToken(data) {
  return Cookies.set(tokenKey, data)
}

export function removeToken() {
  clearTabs()
  return Cookies.remove(tokenKey)
}

export const clearTabs = () => {
  localStorage.removeItem(TABSKEY)
}

export function login() {
  window.location.href = '/login'
}

const whiteListApi = ['/admin/login', '/admin/getCaptcha', '/admin/forgetPwd', '/admin/resetPwd']
export function validateWhiteListApi(url) {
  return whiteListApi.includes(url)
}
