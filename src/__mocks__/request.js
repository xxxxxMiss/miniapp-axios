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

  if (config.method) {
    config.method = config.method.toUpperCase()
  }
  Reflect.deleteProperty(config, 'success')
  Reflect.deleteProperty(config, 'fail')

  if (error) {
    fail(error)
  } else {
    success({
      data: {},
      statusCode: 200,
      header: {},
      config,
    })
  }
}

export default function request(config) {
  if (typeof config !== 'object') {
    return Promise.reject(
      new TypeError(`config must be an object, but got: ${config}`)
    )
  }
  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      },
    })
  })
}
