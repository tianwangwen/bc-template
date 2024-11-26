import { Request } from '@/network/request'

class MessageListApi {
  async sysMessageRemind(params) {
    const request = new Request('/admin/sysMessageRemind', params)
    return await request.showMessage(true).start()
  }
  async downloadFailFile(params) {
    const request = new Request('/admin/downloadFailFile', params, 'get', undefined, {
      'responseType': 'blob'
    })
    return await request.showMessage(true).start()
  }
  async fetchStpRemind(params) {
    const request = new Request('/admin/fetchStpRemind', params)
    return await request.showMessage(true).start()
  }
  async firstLoginStpRemind(params) {
    const request = new Request('/admin/firstLoginStpRemind', params)
    return await request.showMessage(true).start()
  }
  async defaultStpRemindImage(params) {
    const request = new Request('/admin/defaultStpRemindImage', params)
    return await request.showMessage(true).start()
  }
}

export default new MessageListApi()
