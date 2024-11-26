import { Request } from '@/network/request'

class SmsApi {
  async queryMobileSmsSessionList(params) {
    const request = new Request('/admin/queryMobileSmsSessionList', params)
    return await request.showMessage(true).start()
  }
  async queryMobileSmsDetailBySessionId(params) {
    const request = new Request('/admin/queryMobileSmsDetailBySessionId', params)
    return await request.showMessage(true).start()
  }
  async sensitiveWordsJudgment(params) {
    const request = new Request('/admin/sensitiveWordsJudgment', params)
    return await request.showMessage(true).start()
  }
  async sendMobileSms(params) {
    const request = new Request('/admin/sendMobileSms', params)
    return await request.showMessage(true).start()
  }
  async invalidSession(params) {
    const request = new Request('/admin/invalidSession', params)
    return await request.showMessage(true).start()
  }
  async getMobileSmsTemplateList(params) {
    const request = new Request('/admin/queryMobileTemplateByFilter', params)
    return await request.showMessage(true).start()
  }
  async getDunUserBindPhones(params) {
    const request = new Request('/admin/getDunUserBindPhones', params, 'get')
    return await request.showMessage(true).start()
  }
  async queryMobileSmsDetail(params) {
    const request = new Request('/admin/queryMobileSmsDetail', params)
    return await request.showMessage(true).start()
  }
  async queryMobileSmsRemainder(params) {
    const request = new Request('/admin/queryMobileSmsRemainder', params)
    return await request.showMessage(true).start()
  }
  async getDunCaseIdByUserId(params) {
    const request = new Request('/admin/getDunCaseIdByUserId', params)
    return await request.start()
  }
  async queryProbableNum(params) {
    const request = new Request('/admin/batchOwnerSendQueryProbableNum', params)
    return await request.showMessage(true).start()
  }
  async createBatchOwnerSend(params) {
    const request = new Request('/admin/batchOwnerSendCreateBatchOwnerSend', params)
    return await request.showMessage(true).start()
  }
  async getFlowJumpLink(params) {
    const request = new Request('/admin/taskactionGetFlowJumpLink', params)
    return await request.showMessage(true).start()
  }
  
}

export default new SmsApi()
