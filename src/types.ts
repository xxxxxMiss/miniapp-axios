export interface RequestConfig {
  url: string
  baseURL?: string
  method?: string
  responseType?: string
  dataType?: string
  transformRequest?: Array<(data: object, headers: object) => object | void>
  transformResponse?: Array<(response: object) => object | void>
  headers?: object
  params?: object
  paramsSerializer?: (args: object) => string
  data?: object
  timeout?: number
  retry?: number
}

export type Resolve<T> = (config: T) => T | Promise<T>

export type Reject = ((error: any) => void) | undefined

export type Handlers<T> = Array<(arg: T | any) => T | Promise<T> | any>

export interface Interceptor<T> {
  use: (resolve: Resolve<T>, reject: Reject) => void
  handlers: Handlers<T>
}

export interface MpRequest {

}
