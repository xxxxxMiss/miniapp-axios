// axios.interceptors.request.use(resolve, reject)
const use = handlers => (resolve, reject) => {
  if (typeof resolve !== 'function') {
    throw new TypeError(`resolve must be a function, received ${resolve}`)
  }
  if (typeof reject !== 'function') {
    reject = function reject() {}
  }
  handlers.push(resolve, reject)
}

const request = {}
request.handlers = []
request.use = use(request.handlers)

const response = {}
response.handlers = []
response.use = use(response.handlers)

export default {
  request,
  response,
}
