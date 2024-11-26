import axios from '../network'
import { ElLoading, ElMessage } from 'element-plus'
import { nextTick } from 'vue'

export class Request {
  url = ''
  params = {}
  method = 'post'
  needLoading = false
  needMessage = false
  needError = false
  needReponseAll = false
  contentType = 'json'
  other = {}

  constructor(url, params, method = 'post', contentType = 'json', other = {}) {
    this.url = url
    this.params = params
    this.method = method
    this.contentType = contentType
    this.other = other
  }

  showLoading(show) {
    this.needLoading = show
    return this
  }

  showMessage(show) {
    this.needMessage = show
    return this
  }

  reponseAll(all) {
    this.needReponseAll = all
    return this
  }

  useError(use) {
    this.needError = use
    return this
  }

  async start() {
    let loading
    let data
    try {
      if (this.needLoading) {
        loading = ElLoading.service({
          fullscreen: true
        })
      }
      let reponse
      if (this.contentType === 'form-data') {
        const formData = new FormData()
        Object.keys(this.params).forEach(item => {
          formData.append(item, this.params[item])
        })
        reponse = await axios({
          headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8'
          },
          url: this.url,
          method: this.method,
          data: formData
        }).catch(e => {
          throw e
        })
      } else {
        const dataKey = this.method === 'post' ? 'data' : 'params'
        const params = {
          url: this.url,
          [dataKey]: this.params,
          method: this.method,
          ...this.other
        }
        reponse = await axios(params).catch(e => {
          throw e
        })
      }
      const code = reponse?.code
      if (code === 0) {
        if (this.needReponseAll) {
          data = reponse
        } else {
          data = reponse.result
        }
      } else {
        if (this.needReponseAll) {
          data = reponse
        } else if (this.needMessage) {
          ElMessage.error((reponse && reponse.message) || '接口错误，请联系管理员')
        }
      }
    } catch (e) {
      if (this.needMessage) {
        const msg = e.message || '网络异常，请稍后重试'
        msg && ElMessage.error(msg)
      }
      if (this.needError) {
        throw e
      }
    } finally {
      if (this.needLoading) {
        nextTick(() => {
          loading.close()
        })
      }
    }
    return data
  }
}
