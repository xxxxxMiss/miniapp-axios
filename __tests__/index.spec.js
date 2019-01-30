import mpAxios from '../src'

process.env.timeout = 'off'
jest.mock('../src/request.js')

describe('mpAxios(config)', () => {
  it('should throw an error when config.url is missing', async () => {
    await expect(mpAxios({})).rejects.toThrow(/missing config\.url/)
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

  it('post method', async () => {
    await expect(
      mpAxios.post('https://jestjs.io/post', {
        name: 'jest',
      })
    ).resolves.toMatchObject({
      config: {
        url: 'https://jestjs.io/post',
        method: 'POST',
        data: {
          name: 'jest',
        },
      },
    })
  })

  it('get method', async () => {
    await expect(mpAxios.get('https://jestio.io/get')).resolves.toHaveProperty(
      'config'
    )
  })
})
