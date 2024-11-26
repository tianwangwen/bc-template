import { Request } from '@/network/request'

class ResourceApi {

  async update(params) {
    const request = new Request('/admin/document/update', params);
    return await request.showMessage(true).start();
  }
  async uploadFile(params) {
    const request = new Request('/admin/oss/uploadFile', params, 'post', 'form-data');
    return await request.showMessage(true).start();
  }
  async downloadFile(url, unDownLoad = true) {
    const request = new Request(`/admin/oss/download?filePath=${url}`, {}, 'post', undefined, {
      responseType: 'blob',
      unDownLoad
    })
    return await request.reponseAll(true).start()
  }
}

export default new ResourceApi()
