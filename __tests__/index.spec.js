import mpAxios from '../src'

jest.mock('../src/request.js')

describe('mpAxios(config)', () => {
  it('should throw an error when config is not an object', async () => {
    await expect(mpAxios('test')).rejects.toThrow(/must be an object/)
  })

  it('should throw an error when config.url is missing', async () => {
    await expect(mpAxios({})).rejects.toThrow(/missing config\.url/)
  })

  it('should throw an error when config.method is missing', async () => {
    await expect(mpAxios({ url: 'https://jestjs.io' })).rejects.toThrow(
      /missing config\.method/
    )
  })

  it('should throw an error when config.method is invalid', async () => {
    await expect(
      mpAxios({ url: 'https://jestjs.io', method: 'fuck' })
    ).rejects.toThrow(/invalid config\.method/)
  })

  it('case-insensitive of config.method', async () => {
    await expect(
      mpAxios({ url: 'https://jestjs.io', method: 'GET' })
    ).resolves.toBeTruthy()
    await expect(
      mpAxios({ url: 'https://jestjs.io', method: 'get' })
    ).resolves.toBeTruthy()
  })
})

describe('interceptors', () => {
  let config = null
  beforeEach(() => {
    config = {
      url: 'https://jestjs.io/user/123',
      method: 'get',
    }
  })
  describe('request', () => {
    it('passed the `config` to the interceptor', async () => {
      let _conf = null
      mpAxios.interceptors.request.use(conf => {
        _conf = conf
        conf.name = 'test'
        return conf
      })
      await expect(mpAxios(config)).resolves.toHaveProperty(
        'config.name',
        'test'
      )
      expect(config === _conf).toBeTruthy()
    })

    it('add multiple request interceptors', async () => {
      mpAxios.interceptors.request.use(conf => {
        conf.name = 'test'
        return conf
      })
      mpAxios.interceptors.request.use(conf => {
        conf.age = 20
        return conf
      })
      await expect(mpAxios(config)).resolves.toMatchObject({
        config: { name: 'test', age: 20 },
      })
    })
  })

  describe('response', () => {
    it('passed response data to the response interceptor', async () => {
      mpAxios.interceptors.response.use(res => {
        res.name = 'response'
        return res
      })
      await expect(mpAxios(config)).resolves.toHaveProperty('name', 'response')
    })

    it('add multiple response inteceptors', async () => {
      mpAxios.interceptors.response.use(res => {
        res.data.key1 = 'value1'
        return res
      })
      mpAxios.interceptors.response.use(res => {
        res.data.key2 = 'value2'
        return res
      })
      await expect(mpAxios(config)).resolves.toMatchObject({
        data: {
          key1: 'value1',
          key2: 'value2',
        },
      })
    })
  })
})

describe('mpAxios#verb', () => {
  it('verb methods', () => {
    ;[
      'options',
      'get',
      'head',
      'post',
      'put',
      'delete',
      'trace',
      'connect',
    ].forEach(method => {
      expect(typeof mpAxios[method] === 'function').toBeTruthy()
    })
  })

  it('get method', async () => {
    await expect(mpAxios.get('https://jestjs.io')).resolves.toMatchObject({
      config: {
        url: 'https://jestjs.io',
        method: 'GET',
      },
    })
  })
})
