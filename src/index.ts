import interceptors from './interceptor'
import request from './request'
import defaults from './defaults'

import { RequestConfig } from './types'

const mpRequest = (config: RequestConfig) => {
    if (typeof config === 'string') {
      config = { url: config }
    }
    config = Object.assign({}, mpRequest.defaults, config)
    const handlers = interceptors.request.handlers
      .concat([request, undefined])
      .concat(interceptors.response.handlers)

    let promise = Promise.resolve(config)
    while (handlers.length) {
      promise = promise.then(handlers.shift(), handlers.shift())
    }
    return promise
  }

  // TODO: how to express a subsequent prop after object has created?
;['options', 'get', 'head', 'delete', 'trace', 'connect'].forEach(method => {
  mpRequest[method] = (url: string, config = {}) => {
    return mpRequest({ ...config, url, method })
  }
})
;['post', 'put'].forEach(method => {
  mpRequest[method] = (url: string, data: object, config = {}) => {
    return mpRequest({ ...config, url, data, method })
  }
})

mpRequest.interceptors = interceptors
mpRequest.defaults = defaults

export default mpRequest
