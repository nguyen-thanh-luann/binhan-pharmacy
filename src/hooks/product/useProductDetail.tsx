import { productAPI } from '@/services'
import { ProductDetailRes } from '@/types'
import useSWR from 'swr'

interface useProductDetailProps {
  key: string
  shouldFetch?: boolean
  product_id: number
}

interface useProducDetailRes {
  data: ProductDetailRes
  isValidating: boolean
}

export const useProductDetail = ({
  shouldFetch = true,
  key,
  product_id,
}: useProductDetailProps): useProducDetailRes => {
  const { data, isValidating } = useSWR(
    key,
    !shouldFetch || !product_id
      ? null
      : () => productAPI.getProductDetail(product_id).then((res: any) => res?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    data,
    isValidating,
  }
}
