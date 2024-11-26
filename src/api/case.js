import { Request } from '@/network/request'

class CaseApi {

  async queryWarningRecordsCount(params) {
    const request = new Request('/quality/warningRecord/queryWarningRecordsCount', params);
    return await request.showMessage(true).start();
  }
}

export default new CaseApi()
