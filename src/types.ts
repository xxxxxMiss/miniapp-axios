export interface RequestConfig {
  url: string
  baseURL?: string
  method?: string
  responseType?: string
  dataType?: string
  transformRequest?: Array<
    (data: object, headers: object) => object | void
  > | null
  transformResponse?: Array<(response: object) => object | void> | null
  headers?: object
  params?: object | null
  paramsSerializer?: ((args: object) => string) | null
  data?: object
  timeout?: number
  retry?: number
}

export interface Response {
  status: number
  statusText: string
  data: string | object | ArrayBuffer
  headers: object
  config: RequestConfig
}

export type Resolve<T> = (config: T) => T | Promise<T>

export type Reject = ((error: any) => void) | undefined

export type Handlers<T> = Array<(arg: T | any) => T | Promise<T> | any>

export interface Interceptor<T> {
  use: (resolve: Resolve<T>, reject: Reject) => void
  handlers: Handlers<T>
}

export interface MpRequest {
  (config: RequestConfig): Promise<Response>

  interceptors: {
    request: Interceptor<RequestConfig>
    response: Interceptor<Response>
  }
  defaults: RequestConfig

  options<T = any>(url: string, config?: object): Promise<T>
  get<T = any>(url: string, config?: object): Promise<T>
  head<T = any>(url: string, config?: object): Promise<T>
  delete<T = any>(url: string, config?: object): Promise<T>
  trace<T = any>(url: string, config?: object): Promise<T>
  connect<T = any>(url: string, config?: object): Promise<T>

  post<T = any>(url: string, data: object, config: object): Promise<T>
  put<T = any>(url: string, data: object, config: object): Promise<T>
}
