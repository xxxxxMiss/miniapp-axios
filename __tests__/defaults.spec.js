import mpAxios from '../src'

process.env.timeout = 'on'
jest.setTimeout(60000)
jest.mock('../src/request')

describe('defaults.baseURL', () => {
  it('baseURL', async () => {
    await expect(
      mpAxios({
        baseURL: 'https://jestjs.io',
        url: '/path/a/b',
      })
    ).resolves.toHaveProperty('config.url', 'https://jestjs.io/path/a/b')
  })

  it('should not prepend baseURL when url is absolute', async () => {
    await expect(
      mpAxios({
        baseURL: 'https://jestjs.io',
        url: 'https://google.com',
      })
    ).resolves.toHaveProperty('config.url', 'https://google.com')
  })

  it('should not prepend baseURL when url is absolute without schema', async () => {
    await expect(
      mpAxios({
        baseURL: 'https://jestjs.io',
        url: '//path/a/b',
      })
    ).resolves.toHaveProperty('config.url', '//path/a/b')
  })

  it('use restful api is ok', async () => {
    await expect(
      mpAxios.get('/path/foo', {
        baseURL: 'https://jestjs.io',
      })
    ).resolves.toHaveProperty('config.url', 'https://jestjs.io/path/foo')
  })

  it('use restful api and url without schema is ok', async () => {
    await expect(
      mpAxios.get('//path/foo', {
        baseURL: 'https://jestjs.io',
      })
    ).resolves.toHaveProperty('config.url', '//path/foo')
  })
})

describe('defaults.timeout', () => {
  it('should throw error when timeout', async () => {
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
        timeout: 500,
      })
    ).rejects.toThrow(/timeout of/)
  })

  it('automatically cancel request when timeout', async () => {
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
        timeout: 500,
      })
    ).rejects.toThrow(/has aborted/)
  })
})

describe('set global config: mpAxios.defaults', () => {
  beforeAll(() => {
    mpAxios.defaults.baseURL = 'https://google.com'
    mpAxios.defaults.headers = {
      referer: 'https://jestjs.io',
      'content-type': 'text/html',
    }
  })

  it('mpAxios(config)', async () => {
    await expect(
      mpAxios({
        url: '/path/bar',
      })
    ).resolves.toHaveProperty('config.url', 'https://google.com/path/bar')
  })

  it('mpAxios#verb', async () => {
    await expect(
      mpAxios({
        url: '/path/baz',
      })
    ).resolves.toHaveProperty('config.url', 'https://google.com/path/baz')
  })

  it('overwrite global baseURL', async () => {
    await expect(
      mpAxios({
        url: '/path/xx',
        baseURL: 'https://google.com',
      })
    ).resolves.toHaveProperty('config.url', 'https://google.com/path/xx')
  })

  it('overwrite global baseURL with absolute url', async () => {
    await expect(
      mpAxios({
        url: 'https://google.com/path/yy',
      })
    ).resolves.toHaveProperty('config.url', 'https://google.com/path/yy')
  })

  it('should delete the forbidden header `referer`', async () => {
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
      })
    ).resolves.not.toHaveProperty('config.header.referer')
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
      })
    ).resolves.toHaveProperty(['config', 'header', 'content-type'])
  })

  it('should delete the forbidden header `Referer`', async () => {
    mpAxios.defaults.headers = {
      Referer: 'https://jestjs.io',
      'content-type': 'text/html',
    }
    await expect(
      mpAxios({
        url: 'https://jestjs.io',
      })
    ).resolves.not.toHaveProperty('config.header.Referer')
  })

  it('set global transformRequest', async () => {
    mpAxios.defaults.transformRequest = [
      data => {
        data.name = 'transformRequest'
      },
    ]
    await expect(
      mpAxios.post('https://google.com', {
        name: 'test',
      })
    ).resolves.toHaveProperty('config.data.name', 'transformRequest')
  })

  it('set global transformResponse', async () => {
    mpAxios.defaults.transformResponse = [
      data => {
        data.name = 'transformResponse'
      },
    ]
    await expect(mpAxios.get('https://google.com')).resolves.toHaveProperty(
      'name',
      'transformResponse'
    )
  })

  it('defaults.retry', async () => {
    mpAxios.defaults.retry = 2
    mpAxios.defaults.timeout = 1000
    await expect(mpAxios.get('https://jestjs.io')).rejects.toThrow(/0$/)
  })
})
