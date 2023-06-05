import produce, { Draft } from 'immer'
import { useState } from 'react'
import useSWR, { Key } from 'swr'

import { DEFAULT_LIMIT } from '@/constants'
import { removeEmptyValueFromObject } from '@/helper'
import {
  FetcherProductFilter,
  FetcherProductFilterPartialParams,
  HTTPListProductFilterResponse,
  HTTPProductFilterResponse,
  QueryList,
} from '@/types'
import { PublicConfiguration } from 'swr/_internal'

export interface UseProductFilterProps<Data, Params extends QueryList = any> {
  fetcher: FetcherProductFilter<Params, Data> | FetcherProductFilterPartialParams<Params, Data>
  mutateFetcherResponse?: (
    params: HTTPListProductFilterResponse<Data[]>
  ) => HTTPListProductFilterResponse<Data[]>
  key: Key
  initialParams?: Params
  config?: Partial<PublicConfiguration<any, any, (args_0: string) => any>>
  result_key?: string
}

export const useProductFilter = <Data = any, Params extends QueryList = any>({
  key,
  config,
  initialParams,
  fetcher,
  mutateFetcherResponse,
}: UseProductFilterProps<Data, Params>) => {
  const { isValidating, data, error, mutate } = useSWR<
    HTTPListProductFilterResponse<Data[]>,
    Params
  >(key, () => fetcherHandler(), config)
  const [params, setParams] = useState<Params>(getDefaultParams)
  const hasMore = (data?.result?.length || 0) < (data?.paginate?.total || 0)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [isFilter, setIsFilter] = useState<boolean>(false)

  function getDefaultParams(): Params {
    return {
      limit: initialParams?.limit || DEFAULT_LIMIT,
      offset: 0,
      ...initialParams,
    } as Params
  }

  const getDefaultResponse = (): HTTPListProductFilterResponse<Data[]> => ({
    paginate: {
      limit: 0,
      offset: 0,
      total: 0,
    },
    result: [],
    price_max: 0,
    price_min: 0,
  })

  const getDataResponse = <Data>(
    res: HTTPProductFilterResponse<Data[]>
  ): HTTPListProductFilterResponse<Data[]> => {
    const response = res?.data
    return response || getDefaultResponse()
  }

  async function fetcherHandler(): Promise<HTTPListProductFilterResponse<Data[]>> {
    try {
      const res = await fetcher(params)
      if (mutateFetcherResponse) {
        return mutateFetcherResponse(res?.data) || getDefaultResponse()
      }
      return getDataResponse(res)
    } catch (error) {
      return getDefaultResponse()
    }
  }

  const refresh = () => {
    mutate()
    setParams(getDefaultParams())
  }

  const getMore = async (onSuccess?: (params: Data[]) => void, onError?: () => void) => {
    if (isLoadingMore || !data?.result?.length || !hasMore || isValidating) return

    setIsLoadingMore(true)
    try {
      const { limit, offset } = data.paginate
      const newParams = removeEmptyValueFromObject<Params>({
        ...params,
        offset: offset + limit,
        limit,
      })
      setParams(newParams)
      const res = await fetcher(newParams)
      const dataRes = getDataResponse(res)
      mutate(
        produce(data, (draft: any) => {
          draft.result.push(...(dataRes.result as Draft<Data[]>))
          draft.paginate = dataRes.paginate
        }),
        false
      )
      setIsLoadingMore(false)
      onSuccess?.(dataRes.result)
    } catch (error) {
      onError?.()
      setIsLoadingMore(false)
    }
  }

  const filter = async (
    funcParams: Params,
    onSuccess?: (data: Data[]) => void,
    onError?: () => void
  ) => {
    try {
      const newParams = removeEmptyValueFromObject<Params>({
        ...params,
        ...funcParams,
        offset: 0,
      })
      setParams(newParams)
      setIsFilter(true)
      const res = await fetcher(newParams)
      const response = getDataResponse<Data>(res)
      mutate(response, false)
      onSuccess?.(response?.result)
      setIsFilter(false)
    } catch (error) {
      setIsFilter(false)
      onError?.()
    }
  }

  const _mutate = (params: Data[], shouldFetch?: boolean) => {
    if (data) {
      mutate(
        {
          paginate: data.paginate,
          result: params,
          price_max: data?.price_max,
          price_min: data?.price_min,
        },
        shouldFetch
      )
    }
  }

  return {
    data: data?.result || [],
    offset: data?.paginate?.offset || 0,
    limit: data?.paginate?.limit || 0,
    total: data?.paginate?.total || 0,
    price_min: data?.price_min || 0,
    price_max: data?.price_max || 0,
    isValidating,
    isLoadingMore,
    isFilter,
    error,
    hasMore,
    params,
    mutate: _mutate,
    filter,
    getMore,
    refresh,
  }
}
