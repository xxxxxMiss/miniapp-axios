import { Interceptor, Handlers, Resolve, Reject, RequestConfig } from './types'

const use = (handlers: Handlers<RequestConfig>) => (
  resolve: Resolve<RequestConfig>,
  reject: Reject
) => {
  if (typeof resolve !== 'function') {
    throw new TypeError(
      `first argument must be a function, but received: ${resolve}`
    )
  }
  if (typeof reject !== 'function') {
    reject = function reject() {}
  }
  handlers.push(resolve, reject)
}

const requestHandlers: Handlers<RequestConfig> = []
const responseHandlers: Handlers<RequestConfig> = []

const request: Interceptor<RequestConfig> = {
  handlers: requestHandlers,
  use: use(requestHandlers),
}

const response: Interceptor<RequestConfig> = {
  handlers: responseHandlers,
  use: use(responseHandlers),
}

export default {
  request,
  response,
}
