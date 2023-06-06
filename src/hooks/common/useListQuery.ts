import produce, { Draft } from 'immer'
import { useState } from 'react'
import useSWR, { Key } from 'swr'

import { DEFAULT_LIMIT } from '@/constants'
import { removeEmptyValueFromObject } from '@/helper'
import { FetcherListResV2, HTTPResV2, QueryList } from '@/types'
import { PublicConfiguration } from 'swr/_internal'

export interface UseListQueryProps<Data, Params extends QueryList = any> {
  fetcher: FetcherListResV2<Params, Data>
  mutateFetcherResponse?: (params: HTTPResV2<Data[]>) => HTTPResV2<Data[]>
  key: Key
  initialParams?: Params
  config?: Partial<PublicConfiguration<any, any, (args_0: string) => any>>
  result_key?: string
}

export const useListQuery = <Data = any, Params extends QueryList = any>({
  key,
  config,
  initialParams,
  fetcher,
  mutateFetcherResponse,
}: UseListQueryProps<Data, Params>) => {
  const { isValidating, data, error, mutate } = useSWR<HTTPResV2<Data[]>, Params>(
    key,
    () => fetcherHandler(),
    config
  )

  
  const [params, setParams] = useState<Params>(getDefaultParams)
  const hasMore = (data?.data?.length || 0) < (data?.total || 0)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

  function getDefaultParams(): Params {
    return {
      limit: initialParams?.limit || DEFAULT_LIMIT,
      offset: 0,
      ...initialParams,
    } as Params
  }

  const getDefaultResponse = (): HTTPResV2<Data[]> => ({
    limit: 0,
    offset: 0,
    total: 0,
    data: [],
  })

  const getDataResponse = <Data>(res: HTTPResV2<Data[]>): HTTPResV2<Data[]> => {
    const response: any = res?.data
    return response || getDefaultResponse()
  }

  async function fetcherHandler(): Promise<HTTPResV2<Data[]>> {
    try {
      const res: any = await fetcher(params)
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
    if (isLoadingMore || !data?.data?.length || !hasMore || isValidating) return

    setIsLoadingMore(true)
    try {
      const limit = data.limit
      const offset = data.offset
      const newParams = removeEmptyValueFromObject<Params>({
        ...params,
        offset: offset + limit,
        limit,
      })
      setParams(newParams)
      const res: any = await fetcher(newParams)
      const dataRes: any = getDataResponse(res)
      mutate(
        produce(data, (draft: any) => {
          draft.data.push(...(dataRes.data as Draft<Data[]>))
          draft.limit = dataRes.limit
          draft.offset = dataRes.offset
          draft.total = dataRes.total
        }),
        false
      )
      setIsLoadingMore(false)
      onSuccess?.(dataRes?.data)
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

      const res: any = await fetcher(newParams)
      const response: any = getDataResponse<Data>(res)
      mutate(response, false)
      onSuccess?.(response?.result)
    } catch (error) {
      onError?.()
    }
  }

  const _mutate = (params: Data[], shouldFetch?: boolean) => {
    if (data) {
      mutate(
        { data: params, limit: data?.limit, offset: data?.offset, total: data?.total },
        shouldFetch
      )
    }
  }

  return {
    data: data?.data || [],
    offset: data?.offset || 0,
    limit: data?.limit || 0,
    total: data?.total || 0,
    isValidating,
    isLoadingMore,
    error,
    hasMore,
    params,
    mutate: _mutate,
    filter,
    getMore,
    refresh,
  }
}
