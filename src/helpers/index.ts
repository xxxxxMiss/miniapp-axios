import { RequestConfig } from '../types'

export const isAbsoluteURL = (url: string) =>
  /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)

export const combineURL = (baseURL = '', relativeURL?: string) => {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

export const buildURL = (
  url: string,
  params?: RequestConfig['params'],
  paramsSerializer?: RequestConfig['paramsSerializer']
) => {
  if (!params) {
    return url
  }

  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else {
    let parts: string[] = []

    forEach(params, function serialize(val: any, key: string) {
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

export const getWxConfig = (obj: any) => {
  const result = {}
  ;['url', 'data', 'method', 'dataType', 'responseType'].forEach(key => {
    if (obj[key]) {
      result[key] = obj[key]
    }
  })
  const headers = obj.headers || obj.header
  if (headers.referer) {
    Reflect.deleteProperty(headers, 'referer')
  }
  if (headers.Referer) {
    Reflect.deleteProperty(headers, 'Referer')
  }
  result.header = headers
  return result
}

function encode(val: string) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

function forEach(obj: any, fn: () => void) {
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

function isDate(val: any) {
  return Object.prototype.toString.call(val) === '[object Date]'
}

function isObject(val: any) {
  return val !== null && typeof val === 'object'
}
