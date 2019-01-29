import mpAxios from '../src'

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

describe('mpAxios.defaults', () => {
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
})
