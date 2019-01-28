import * as helpers from './helpers'

export default function request(config) {
  let {
    transformRequest,
    transformResponse,
    method,
    data,
    params,
    paramsSerializer,
    url,
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

  config.url = helpers.buildURL(url, params, paramsSerializer)
  config.method = method.toUpperCase()
  config = helpers.toWxConfig(config)

  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
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
