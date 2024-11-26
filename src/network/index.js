import axios from 'axios'
import Cookies from 'js-cookie'
import { BASE_URL } from '@/utils/const'
import { tokenKey, login, removeToken, getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Pragma: 'no-cache',
  }
})

const downloadBlob = response => {
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
  reader.onload = e => {
    const a = document.createElement('a')
    a.download = filename
    a.href = e.target && e.target.result
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

service.interceptors.request.use(
  config => {
    config.headers[tokenKey] = getToken()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
const downloadUrls = [
  '/upload/downRadioTemplate',
  '/quality/sensitiveStatic/exportOnlineVoiceStatic',
  '/quality/sensitiveStatic/exportOnlineSensitiveStatic',
  '/quality/sensitiveStatic/exportOfflineSensitiveStatic',
  '/quality/list/exportInspectStatics',
  '/admin/oss/download',
  '/admin/report/exportIntoAndExitReport',
  '/admin/report/exportInterviewReport',
  '/admin/user/downTemplate'
]

service.interceptors.response.use(
  response => {
    if (response.status === 401 || response.status === 403 || response.status === 503) {
      removeToken()
      return login()
    }
    if (
      response.headers &&
      [
        'audio/x-wav',
        'application/x-download',
        'application/x-download;charset=utf-8',
        'application/x-msdownload',
        'application/octet-stream',
        'application/octet-stream;charset=utf-8',
        'application/vnd.ms-excel;charset=utf-8',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ].includes(response.headers['content-type']?.toLocaleLowerCase())
    ) {
      const unDownLoad = !!response.config.unDownLoad
      // 不下载，获取文件流
      if (response.request.responseType === 'blob') {
        if (downloadUrls.find((item) => response.request.responseURL.includes(item))) {
          !unDownLoad && downloadBlob(response);
        }
        return { code: 0, result: response.data, message: '' }
      }
      //  else {
      //   return { code: 0, result: response.data, message: '' }
      // }
    }
    return response.data
  },
  error => {
    if (error.response.status === 401 || error.response.status === 403) {
      removeToken()
      return login()
    }
    return Promise.reject(error)
  }
)

export default service
