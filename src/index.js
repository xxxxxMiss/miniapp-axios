import interceptors from './interceptor'
import request from './request'

const mpRequest = config => {
  const handlers = [request, undefined]
  interceptors.request.handlers.forEach(fn => {
    handlers.unshift(fn)
  })
  interceptors.response.handlers.forEach(fn => {
    handlers.push(fn)
  })

  let promise = Promise.resolve(config)
  while (handlers.length) {
    promise.then(handlers.shift(), handlers.shift())
  }
  return promise
}

;[
  'options',
  'get',
  'head',
  'post',
  'put',
  'delete',
  'trace',
  'connect',
].forEach(method => {
  mpRequest[method] = (url, config = {}) => {
    return mpRequest(url, { ...config, method: method.toUpperCase() })
  }
})

mpRequest.interceptors = interceptors

export default mpRequest
