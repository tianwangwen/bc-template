import { Request } from '@/network/request'

class MessageApi {
  async unreadCount(params) {
    const request = new Request('/admin/hrm/messageCenter/unreadCount', params)
    return await request.showMessage(true).start()
  }
}

export default new MessageApi()
