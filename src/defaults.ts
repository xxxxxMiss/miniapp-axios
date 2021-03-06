import { RequestConfig } from './types'

const defaults: RequestConfig = {
  url: '',
  baseURL: '',
  method: 'get',
  responseType: 'text',
  dataType: 'json',
  transformRequest: null,
  transformResponse: null,
  headers: {
    'content-type': 'application/json',
  },
  params: null,
  paramsSerializer: null,
  data: {},
  timeout: 60000, // wx.request default timeout
  retry: 0,
}

export default defaults
