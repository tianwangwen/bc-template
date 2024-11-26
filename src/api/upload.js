import { Request } from '@/network/request'

class UploadFileApi {
  async uploadFile(params) {
    const request = new Request('/admin/oss/uploadFile', params, 'post', 'form-data' )
    return await request.showMessage(true).start()
  }

  // 下载
  async downLoadFile (params) {
    const request = new Request('/admin/oss/download', params, 'post', 'blob')
    return await request.showMessage(true).start()
  }

}
export default new UploadFileApi()
