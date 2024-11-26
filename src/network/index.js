import axios from 'axios'
import { login, removeToken, getToken, tokenKey, validateWhiteListApi } from '@/utils/auth';

const service = axios.create({
  // baseURL: '/api',
  baseURL: '/api/ddstp',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Pragma: 'no-cache',
  }
})

const downloadBlob = (response) => {
  const blob = response.data
  const disposition = response.headers['content-disposition']
  let filename = ''
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  const matches = filenameRegex.exec(disposition)
  if (matches !== null && matches[1]) {
    filename = matches[1].replace(/['"]/g, '')
    filename = decodeURI(filename)
  }
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = (e) => {
    const a = document.createElement('a')
    a.download = filename
    a.href = (e.target && e.target.result)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

service.interceptors.request.use(
  (config) => {
    const ticket = getToken()
    if (ticket || validateWhiteListApi(config.url)) {
      config.headers[tokenKey] = ticket
    } else {
      return login()
    }
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    if (response.status === 401 || response.status === 403 || response.status === 503) {
      removeToken()
      return login()
    }
    if (
      (response.headers && response.headers['content-type'] === 'application/octet-stream;charset=utf-8') ||
      response.headers['content-type'] === 'application/x-download;charset=utf-8' ||
      response.headers['content-type'] === 'application/octet-stream' ||
      response.headers['content-type'] === 'application/x-msdownload' ||
      response.headers['content-type'] === 'application/x-download' ||
      response.headers['content-type'] === 'application/vnd.ms-excel;charset=UTF-8' ||
      response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      if (response.request.responseType === 'blob') {
        downloadBlob(response)
      }
      return { code: 0, result: {}, message: '' }
    }
    return response.data
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      removeToken()
      return login()
    }
    return Promise.reject(error)
  }
)

export default service
