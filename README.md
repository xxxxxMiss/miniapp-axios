# miniapp-axios

> An encapsulation of miniapp request and using the similar api as axios

[![Build Status](https://img.shields.io/travis/TOC-TEAM/miniapp-axios/master.svg)](https://travis-ci.org/TOC-TEAM/miniapp-axios)
[![Codecov branch](https://img.shields.io/codecov/c/github/TOC-TEAM/miniapp-axios/master.svg)](https://codecov.io/gh/TOC-TEAM/miniapp-axios)
[![NPM](https://img.shields.io/npm/v/miniapp-axios.svg)](https://www.npmjs.com/package/miniapp-axios)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

## Install

```bash
npm install --save miniapp-axios
```

## Usage

```js
import mpAxios from 'miniapp-axios'
```

## Example

Performing a `GET` request

```js
// Make a request for a user with a given ID
mpAxios
  .get('/user?ID=12345')
  .then(function(response) {
    console.log(response)
  })
  .catch(function(error) {
    console.log(error)
  })

// Optionally the request above could also be done as
mpAxios
  .get('/user', {
    params: {
      ID: 12345,
    },
  })
  .then(function(response) {
    console.log(response)
  })
  .catch(function(error) {
    console.log(error)
  })
```

Performing a `POST` request

```js
mpAxios
  .post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone',
  })
  .then(function(response) {
    console.log(response)
  })
  .catch(function(error) {
    console.log(error)
  })
```

## mpAxios API

Requests can be made by passing the relevant config to `mpAxios`.

##### mpAxios(config)

```js
// Send a POST request
mpAxios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
})
```

```js
// GET request for remote image
mpAxios({
  method: 'get',
  url: 'http://bit.ly/2mTM3nY',
  dataType: 'json',
}).then(function(response) {})
```

##### mpAxios(url[, config])

```js
// Send a GET request (default method)
mpAxios('/user/12345')
```

### Request method aliases

For convenience aliases have been provided for all supported request methods.

##### mpAxios.get(url[, config])

##### mpAxios.delete(url[, config])

##### mpAxios.head(url[, config])

##### mpAxios.options(url[, config])

##### mpAxios.post(url[, data[, config]])

##### mpAxios.put(url[, data[, config]])

###### NOTE

When using the alias methods `url`, `method`, and `data` properties don't need to be specified in config.

## Request Config

These are the available config options for making requests. Only the `url` is required. Requests will default to `GET` if `method` is not specified.

```js
{
  // `url` is the server URL that will be used for the request
  url: '/user',

  // `method` is the request method to be used when making the request
  method: 'get', // default

  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of mpAxios to pass relative URLs
  // to methods of that instance.
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', and 'PATCH'
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data
    // Returned value is optional
    // return data;
  }],

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    // Returned value is optional
    return data;
  }],

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  // `paramsSerializer` is an optional function in charge of serializing `params`
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  data: {
    firstName: 'Fred'
  },

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  // Keep the same as wx.request defaults.
  timeout: 60000,

  // How many times to retry request when timeout
  retry: 0, // default

  // About the two options, see:
  // https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html
  responseType: 'text',
  dataType: 'json'
}
```

## Response Schema

> The original returned by wx.request

## Config Defaults

You can specify config defaults that will be applied to every request.

### Global mpAxios defaults

```js
mpAxios.defaults.baseURL = 'https://api.example.com'
mpAxios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
}
```

## Interceptors

You can intercept requests or responses before they are handled by `then` or `catch`.

```js
// Add a request interceptor
mpAxios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
mpAxios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error)
  }
)
```

## Cookie

> If you have some requirements about cookies?you can combine the module with [weapp-cookie](https://github.com/charleslo1/weapp-cookie).

## License

MIT © [TOC-TEAM](https://github.com/TOC-TEAM)
