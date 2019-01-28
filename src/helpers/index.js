export const isAbsoluteURL = url => /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)

export const combineURLs = (baseURL, relativeURL) => {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

export const buildURL = (url, params, paramsSerializer) => {
  if (!params) {
    return url
  }

  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else {
    let parts = []

    forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return
      }

      if (Array.isArray(val)) {
        key = key + '[]'
      } else {
        val = [val]
      }

      forEach(val, function parseValue(v) {
        if (isDate(v)) {
          v = v.toISOString()
        } else if (isObject(v)) {
          v = JSON.stringify(v)
        }
        parts.push(encode(key) + '=' + encode(v))
      })
    })

    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

export const getWxConfig = obj => {
  const result = {}
  ;['url', 'data', 'method', 'dataType', 'responseType'].forEach(key => {
    if (obj[key]) {
      result[key] = obj[key]
    }
  })
  const headers = obj.headers
  if (headers.referer) {
    Reflect.deleteProperty(headers, 'referer')
  }
  if (headers.Referer) {
    Reflect.deleteProperty(headers, 'Referer')
  }
  result.header = headers
  return result
}

function encode(val) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  if (typeof obj !== 'object') {
    obj = [obj]
  }

  if (Array.isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}

function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]'
}

function isObject(val) {
  return val !== null && typeof val === 'object'
}
