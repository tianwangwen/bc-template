import { Request } from '@/network/request'

class UserApi {
  async login(params) {
    const request = new Request('/admin/login', params)
    return await request.showMessage(true).start()
  }
  async forgetPwd(params) {
    const request = new Request('/admin/forgetPwd', params)
    return await request.showMessage(true).start()
  }
  async updatePassword(params) {
    const request = new Request('/admin/resetPwd', params)
    return await request.showMessage(true).start()
  }
  async getCaptcha(params) {
    const request = new Request('/admin/getCaptcha', params, 'get')
    return await request.showMessage(true).start()
  }
  async getInfo(params) {
    const request = new Request('/admin/queryAuthUserInfo', params, 'get')
    return await request.showMessage(true).start()
  }
  async getMenuTree(params) {
    const request = new Request('/admin/queryMenuTree', params, 'get')
    return await request.showMessage(true).start()
  }
}

export default new UserApi()
