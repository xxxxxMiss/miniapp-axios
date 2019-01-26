export const getCookie = str => {
  if (typeof str !== 'string') {
    throw new TypeError(`Invalid param: ${str}`)
  }

  const result = wx.getStoreSync('__cookie__') || {}
  const pairs = str.split(/ */)

  pairs.forEach(pair => {
    const [key, value] = pair.split('=')
    result[key] = value
  })

  return result
}

export const setCookie = (key, value) => {
  let result = ''
  if (typeof key === 'object') {
    Object.keys(key).forEach(k => {
      result += `${k}=${key[k]}; `
    })
  } else {
    result += `${key}=${value}; `
  }
  return result
}
