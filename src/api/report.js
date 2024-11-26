
import { Request } from '@/network/request'

class ReportApi {
  // 入离职数据
  async queryJoinDismissionData(params) {
    const request = new Request('/admin/report/intoAndExitReport', params)
    return await request.showMessage(true).start()
  }

  // 面试数据
  async queryAuditionData(params) {
    const request = new Request('/admin/report/interviewReport', params)
    return await request.showMessage(true).start()
  }

  // 首页数据
  async queryDashboardData() {
    const request = new Request('/admin/firstPage/index')
    return await request.showMessage(true).start()
  }

  // 心灵鸡汤
  async querySoupMessages() {
    const request = new Request('/admin/firstPage/getSoupMessages', {}, 'get')
    return await request.showMessage(true).start()
  }

}

export default new ReportApi()
