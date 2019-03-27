import mpAxios from '../src'

process.env.timeout = 'off'
jest.mock('../src/request.js')

describe('config.transformRequest', () => {
  it('should transform data when config.method is post', async () => {
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
        method: 'post',
        data: { name: 'test' },
        transformRequest: [
          data => {
            data.key = 'value'
          },
        ],
      })
    ).resolves.toHaveProperty('config.data', {
      name: 'test',
      key: 'value',
    })
  })

  it('should transform data when config.method is put', async () => {
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
        method: 'put',
        data: {},
        transformRequest: [
          data => {
            data.foo = 'foo'
          },
        ],
      })
    ).resolves.toHaveProperty('config.data', {
      foo: 'foo',
    })
  })

  it('should pass headers as the second param to transformRequest', async () => {
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
        method: 'post',
        data: {},
        headers: {
          'content-type': 'application/json',
        },
        transformRequest: [
          (data, headers) => {
            data.headers = headers
          },
        ],
      })
    ).resolves.toHaveProperty('config.data', {
      headers: {
        'content-type': 'application/json',
      },
    })
  })

  it('multiple transform', async () => {
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
        method: 'post',
        data: {},
        headers: {
          'content-type': 'application/json',
        },
        transformRequest: [
          (data, headers) => {
            data.headers = headers
          },
          data => {
            data.headers['content-type'] = 'json'
          },
        ],
      })
    ).resolves.toHaveProperty('config.data', {
      headers: {
        'content-type': 'json',
      },
    })
  })

  it('transformRequest return `data` is optional', async () => {
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
        method: 'post',
        data: {},
        headers: {
          'content-type': 'application/json',
        },
        transformRequest: [
          (data, headers) => {
            data.headers = headers
          },
          data => {
            data.headers['content-type'] = 'text/html'
            return data
          },
        ],
      })
    ).resolves.toHaveProperty('config.data', {
      headers: {
        'content-type': 'text/html',
      },
    })
  })
})

describe('config.transformResponse', () => {
  it('should transform data', async () => {
    await expect(
      mpAxios.get('https://jestjs.io', {
        transformResponse: [
          res => {
            res.baz = 'baz'
          },
        ],
      })
    ).resolves.toHaveProperty('baz', 'baz')
  })

  it('multiple transform', async () => {
    await expect(
      mpAxios.get('https://jestjs.io', {
        transformResponse: [
          res => {
            res.baz = 'baz'
          },
          res => {
            res.baz = 'foo'
          },
        ],
      })
    ).resolves.toHaveProperty('baz', 'foo')
  })

  it('transform return `res` is optional', async () => {
    await expect(
      mpAxios.get('https://jestjs.io', {
        transformResponse: [
          res => {
            res.baz = 'baz'
          },
          res => {
            res.baz = 'foo'
            return res
          },
        ],
      })
    ).resolves.toHaveProperty('baz', 'foo')
  })
})

describe('config.params', () => {
  it('should serialize params to url', async () => {
    await expect(
      mpAxios.get('https://jestjs.io', {
        params: {
          foo: 'bar',
        },
      })
    ).resolves.toHaveProperty('config.url', 'https://jestjs.io?foo=bar')
  })

  it('use custom paramsSerializer', async () => {
    await expect(
      mpAxios.get('https://jestjs.io', {
        params: {
          foo: 'bar',
        },
        paramsSerializer(params) {
          let ret = ''
          Object.keys(params).forEach(key => {
            ret += `${key}:${params[key]}`
          })
          return ret
        },
      })
    ).resolves.toHaveProperty('config.url', 'https://jestjs.io?foo:bar')
  })
})
