import Cookies from 'js-cookie'
import store from '@/store'

export const TABSKEY = 'sam.huixtj'
export const tokenKey = 'adminToken'
export const FIRSTKEY = 'isFirstLogin'

export function getToken() {
  return Cookies.get(tokenKey, { domain: '.huixtj.com' })
}

// 获取是否第一次登录
export function getFirstLogin() {
  return Cookies.get(FIRSTKEY, { domain: '.huixtj.com' })
}

// 删除第一次登录的标识
export function removeFirstLogin() {
  Cookies.remove(FIRSTKEY, { domain: '.huixtj.com' })
  return
}

export function removeToken() {
  clearTabs()
  removeFirstLogin()
  return Cookies.remove(tokenKey, { domain: '.huixtj.com' })
}

export const clearTabs = () => {
  localStorage.removeItem(TABSKEY)
}

export function login() {
  const curtPath = window.location.href
  const pathname = window.location.pathname
  if(pathname === '/404' || pathname === '/403') {
    window.location.href = 'https://admin.huixtj.com/login'
    return
  }
  window.location.href = `https://admin.huixtj.com/login?returnUrl=${curtPath}`
}

export const hasPermissions = (code) => {
  return store.state.user.info.permissions.includes(code)
}
