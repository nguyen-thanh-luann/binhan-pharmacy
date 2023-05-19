import { productAPI } from '@/services'
import { GetProductByAttributeMinorParams, HTTPListRes, Product } from '@/types'
import produce from 'immer'
import { isObject } from 'lodash'
import useSWR from 'swr'

interface useProductListByAttributeMinorProps {
  key: string
  shouldFetch?: boolean
  params: GetProductByAttributeMinorParams
}

interface useProductListByAttributeMinorPropsRes {
  data: HTTPListRes<Product[]>
  isValidating: boolean
  fetchByOtherAttrValues: (params: GetProductByAttributeMinorParams) => void
}

export const useProductListByAttributeMinor = ({
  shouldFetch = true,
  key,
  params,
}: useProductListByAttributeMinorProps): useProductListByAttributeMinorPropsRes => {  
  const { data, isValidating, mutate } = useSWR(
    key,
    !shouldFetch
      ? null
      : () => productAPI.getProductsByAttributeMinor(params).then((res: any) => res?.data || {}),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  const fetchByOtherAttrValues = async (params: GetProductByAttributeMinorParams) => {
    const res: any = await productAPI.getProductsByAttributeMinor(params)
    const dataRes = res?.data
    if (res?.success) {
      if (isObject(res?.data) && data) {
        mutate(
          produce(data, (draft: any) => {
            draft.result = dataRes?.result
            draft.paginate = dataRes?.paginate
          }),
          false
        )
      }
    }
  }

  return {
    data,
    isValidating,
    fetchByOtherAttrValues,
  }
}
