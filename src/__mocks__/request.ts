import * as helpers from '../helpers'

class RequestTask {
  abort(callback) {
    callback && callback()
  }
}

const methods = [
  'options',
  'get',
  'head',
  'post',
  'put',
  'delete',
  'trace',
  'connect',
]
const wx = {}
wx.request = config => {
  let error = null
  const success = config.success
  const fail = config.fail

  if (!config.url) {
    error = new TypeError('missing config.url')
  } else if (!config.method) {
    error = new TypeError('missing config.method')
  } else if (config.method && !methods.includes(config.method.toLowerCase())) {
    error = new TypeError(
      `invalid config.method: ${
        config.method
      }, avaliable methods are: ${methods.join(',')}`
    )
  }

  Reflect.deleteProperty(config, 'success')
  Reflect.deleteProperty(config, 'fail')

  if (error) {
    fail(error)
  } else {
    success({
      data: {}, // response
      statusCode: 200,
      header: {},
      config, // origin config
    })
  }
  return new RequestTask()
}

let retry = 0
export default function request(config) {
  if (!retry && config.retry !== undefined) {
    retry = config.retry
  }
  let {
    transformRequest,
    transformResponse,
    method,
    data,
    params,
    paramsSerializer,
    url,
    baseURL,
    timeout,
  } = config
  if (
    Array.isArray(transformRequest) &&
    transformRequest.length &&
    (method === 'put' || method === 'post')
  ) {
    config.data = transformRequest.reduce((_data, fn) => {
      return fn(_data, config.headers) || _data
    }, data)
  }

  url = helpers.isAbsoluteURL(url) ? url : helpers.combineURL(baseURL, url)
  config.url = helpers.buildURL(url, params, paramsSerializer)
  config.method = method.toUpperCase()
  config = helpers.getWxConfig(config)

  let requestTask = null
  const onRequest = () =>
    new Promise((resolve, reject) => {
      requestTask = wx.request({
        ...config,
        success: res => {
          if (Array.isArray(transformResponse) && transformResponse.length) {
            res = transformResponse.reduce((_res, fn) => fn(_res) || _res, res)
          }
          // simulate network request
          if (process.env.timeout === 'on') {
            setTimeout(resolve, process.env.resolveTime || 2000, res)
          } else {
            resolve(res)
          }
        },
        fail: res => {
          if (process.env.timeout === 'on') {
            setTimeout(reject, 2000, res)
          } else {
            reject(res)
          }
        },
      })
    })
  const onReject = () =>
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('timeout of ' + timeout + 'ms exceeded')),
        timeout
      )
    })

  return Promise.race([onRequest(), onReject()]).catch(e => {
    if (e instanceof Error && e.message.includes('timeout of')) {
      if (requestTask) {
        requestTask.abort()
        e.message = e.message + ' and the request has aborted ' + retry

        if (retry > 0 && retry--) {
          // for testing
          e.message = e.message.replace(/\d+$/g, retry)
          return request(config)
        }
      }
    }
    throw e
  })
}
