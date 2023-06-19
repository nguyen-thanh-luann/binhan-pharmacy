import { AxiosPromise } from 'axios'
import type { KeyedMutator } from 'swr'

export type HTTPResponse<T> = {
  jsonrpc?: string
  id?: any
  result: {
    code: number
    success: boolean
    message: string
    data: T
  }
}

export interface ListRes<T> {
  has_more: boolean
  limit: number
  offset: number
  total: number
  data: T
}

export interface HTTPListRes<T> {
  result: T
  paginate: {
    limit: number
    offset: number
    total: number
  }
}

export interface HTTPConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  showBackdrop?: boolean
  errorMsg?: string
  successMsg?: string
  showErrorMsg?: boolean
  showSuccessMsg?: boolean
  setLoadingState?: boolean
  disabledLoading?: boolean
}

export interface AsyncHandler<T> {
  fetcher: any
  config?: HTTPConfig
  onSuccess?: (params: T) => void
  onError?: (data: any) => void
}

export interface AsyncHandlerParams<Params, Response> {
  params: Params
  onError?: (data: any) => void
  onSuccess?: (params: Response) => void
  config?: HTTPConfig
}

export type AsyncHandlerNoFetcher<T> = Omit<AsyncHandler<T>, 'fetcher'>

export type QueryListFunction<T, V> = QueryListFetchMoreFunction<T, V> & {
  params: V
}

export type QueryListFetchMoreFunction<T, V> = {
  fetcher?: (params?: V) => AxiosPromise<HTTPResponse<ListRes<T>>>
}

export type QueryListPaginateFunction<T, V> = QueryListFetchMoreFunction<T, V> & {
  params: { page: number }
}

export interface UseQueryListRes<T, V extends QueryList> {
  isValidating: boolean // for both loading and filter
  isLoading: boolean // first loading
  hasMore: boolean
  isLoadingMore: boolean
  offset: number
  data: T[] | undefined
  error: any
  total: number
  params: V
  limit: number
  mutate: KeyedMutator<any>
  getMore: (_?: QueryListFetchMoreFunction<T, V>) => Promise<void>
  paginate: (_: QueryListPaginateFunction<T, V>) => Promise<void>
  filter: (_: QueryListFunction<T, V>) => Promise<void>
  refresh: () => void
}

export interface QueryList {
  limit?: number | undefined
  offset?: number | undefined
  page?: number
  keyword?: string | string[]
}

export interface Pagination {
  limit: number
  offset: number
  total: number
}

export type HTTPResponseDataV2<T> = {
  code: number
  success: boolean
  message: string
  validate_token: boolean
  data: T
}

export type HTTPResponseV2<T> = HTTPResponseDataV2<{
  result: T
  paginate: Pagination
}>

export type HTTPListResponse<T> = {
  result: T
  paginate: Pagination
}

export type HTTPProductFilterResponse<T> = HTTPResponseDataV2<{
  result: T
  paginate: Pagination
  price_max: number
  price_min: number
}>

export type HTTPListProductFilterResponse<T> = {
  result: T
  paginate: Pagination
  price_max: number
  price_min: number
}

export type HTTPResultResponse<T> = {
  jsonrpc: '2.0'
  id: null
  result: T
}

export type HTTPListResV2<T> = {
  message: string
  success: boolean
  status_code: number
  data: {
    limit: number
    offset: number
    total: number
    data: T
  }
}

export type HTTPResV2<T> = {
  limit: number
  offset: number
  total: number
  data: T
}

export type FetcherListResV2<Params, Data> = (params: Params) => Promise<HTTPListResV2<Data[]>>

export type Fetcher<Params, Data> = (params: Params) => Promise<HTTPResponseV2<Data[]>>

export type FetcherPartialParams<Params, Data> = (
  params: Partial<Params>
) => Promise<HTTPResponseV2<Data[]>>

export type FetcherProductFilter<Params, Data> = (
  params: Params
) => Promise<HTTPProductFilterResponse<Data[]>>

export type FetcherProductFilterPartialParams<Params, Data> = (
  params: Partial<Params>
) => Promise<HTTPProductFilterResponse<Data[]>>
