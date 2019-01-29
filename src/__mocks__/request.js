import * as helpers from '../helpers'

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
  } else if (config.timeout && config.timeout > 6000) {
    fail(new Error('timeout of ' + config.timeout + 'ms exceeded'))
  }

  Reflect.deleteProperty(config, 'success')
  Reflect.deleteProperty(config, 'fail')

  // TODO: simulate network request
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
}

export default function request(config) {
  let {
    transformRequest,
    transformResponse,
    method,
    data,
    params,
    paramsSerializer,
    url,
    baseURL,
  } = config
  if (
    Array.isArray(transformRequest) &&
    transformRequest.length &&
    (method === 'put' || method === 'post')
  ) {
    data = transformRequest.reduce((_data, fn) => {
      return fn(_data, config.headers) || _data
    }, data)
  }

  url = helpers.isAbsoluteURL(url) ? url : helpers.combineURL(baseURL, url)
  config.url = helpers.buildURL(url, params, paramsSerializer)
  config.method = method.toUpperCase()
  const wxConfig = helpers.getWxConfig(config)

  return new Promise((resolve, reject) => {
    wx.request({
      ...wxConfig,
      success: res => {
        if (Array.isArray(transformResponse) && transformResponse.length) {
          res = transformResponse.reduce((_res, fn) => fn(_res) || _res, res)
        }
        resolve(res)
      },
      fail: res => {
        reject(res)
      },
    })
  })
}
