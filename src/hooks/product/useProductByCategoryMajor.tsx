import { productAPI } from '@/services'
import { GetProductByCategoryParams, ProductListRes } from '@/types'
import useSWR from 'swr'

interface useProductByCategoryMajorProps {
  key: string
  shouldFetch?: boolean
  params: GetProductByCategoryParams
}

interface useProductByCategoryMajorRes {
  response: ProductListRes
  isValidating: boolean
}

export const useProductByCategoryMajor = ({
  key,
  params,
  shouldFetch = true,
}: useProductByCategoryMajorProps): useProductByCategoryMajorRes => {
  const { data: response, isValidating } = useSWR(
    key,
    !shouldFetch || !params?.category_id || params?.category_id === 0
      ? null
      : () => productAPI.getProductsByCategoryMajor(params).then((res: any) => res?.data || []),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )
  return {
    response,
    isValidating,
  }
}
