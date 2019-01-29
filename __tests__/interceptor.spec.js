import mpAxios from '../src'

jest.useFakeTimers()
jest.mock('../src/request.js')

describe('interceptors', () => {
  function getDefaults() {
    return {
      url: 'https://jestjs.io/user/123',
      method: 'post',
      data: {
        name: 'test',
      },
    }
  }
  let config = null
  beforeEach(() => {
    config = getDefaults()
  })
  describe('request', () => {
    it('should throw an error when first param is not a function', () => {
      expect(() => {
        mpAxios.interceptors.request.use(undefined)
      }).toThrow(/must be a function/)
    })

    it('without second param is ok', () => {
      expect(() => {
        mpAxios.interceptors.request.use(conf => conf, undefined)
      }).not.toThrow()
    })

    it('passed the `config` to the interceptor', async () => {
      mpAxios.interceptors.request.use(conf => {
        conf.data.key = 'value'
        return conf
      })
      await expect(mpAxios(config)).resolves.toHaveProperty(
        'config.data.key',
        'value'
      )
    })

    it('add multiple request interceptors', async () => {
      mpAxios.interceptors.request.use(conf => {
        conf.data.key1 = 'value1'
        return conf
      })
      mpAxios.interceptors.request.use(conf => {
        conf.data.key2 = 'value2'
        return conf
      })
      await expect(mpAxios(config)).resolves.toMatchObject({
        config: {
          data: {
            name: 'test',
            key1: 'value1',
            key2: 'value2',
          },
        },
      })
    })
  })

  describe('response', () => {
    it('passed response to the response interceptor', async () => {
      mpAxios.interceptors.response.use(res => {
        res.name = 'response'
        return res
      })
      await expect(mpAxios(config)).resolves.toHaveProperty('name', 'response')
    })

    it('add multiple response inteceptors', async () => {
      mpAxios.interceptors.response.use(res => {
        res.data.foo = 'foo'
        return res
      })
      mpAxios.interceptors.response.use(res => {
        res.data.bar = 'bar'
        return res
      })

      await expect(mpAxios(config)).resolves.toMatchObject({
        data: {
          foo: 'foo',
          bar: 'bar',
        },
      })
    })
  })
})
