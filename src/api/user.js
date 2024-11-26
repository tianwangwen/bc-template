import { Request } from '@/network/request'

class UserApi {
  async getInfo(params) {
    const request = new Request('/admin/common/getUserInfo', params)
    return await request.showMessage(true).start()
  }
  async queryUserMenu(params) {
    const request = new Request('/admin/common/queryUserMenu', params)
    return await request.showMessage(true).start()
  }
  async queryUserCodeByUserCode(params) {
    const request = new Request('/admin/common/queryUserCodeByUserCode', params)
    return await request.showMessage(true).start()
  }
  
  // 新增用户
  async createUser(params) {
    const request = new Request('/admin/user/insert', params, 'post')
    return await request.showMessage(true).reponseAll(true).start()
  }

    // 查询用户
  async queryUserDetail(params) {
    const request = new Request('/admin/user/detail', params, 'post')
    return await request.showMessage(true).start()
  }

  // 编辑用户
  async updataUserInfo(params) {
    const request = new Request('/admin/user/update', params, 'post')
    return await request.showMessage(true).reponseAll(true).start()
  }

  // 离职
  async setUserDismission(params) {
    const request = new Request('/admin/user/dimission', params, 'post')
    return await request.showMessage(true).start()
  }

  // 校验用户是否存在
  async checkUserExist(params) {
    const request = new Request('/admin/user/userExist', params)
    return await request.showMessage(true).start()
  }

  // 用户再入职
  async reentryUser(params) {
    const request = new Request('/admin/user/reentry', params, 'post')
    return await request.showMessage(true).reponseAll(true).start()
  }
  
}

export default new UserApi()
