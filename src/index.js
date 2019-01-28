import interceptors from './interceptor'
import request from './request'
import defaults from './defaults'

const mpRequest = config => {
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

;['options', 'get', 'head', 'delete', 'trace', 'connect'].forEach(method => {
  mpRequest[method] = (url, config = {}) => {
    return mpRequest({ ...config, url, method })
  }
})
;['post', 'put'].forEach(method => {
  mpRequest[method] = (url, data, config = {}) => {
    return mpRequest({ ...config, url, data, method })
  }
})

mpRequest.interceptors = interceptors
mpRequest.defaults = defaults

export default mpRequest
