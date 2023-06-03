import { promotionAPI } from '@/services'
import { PromotionProductItemRes } from '@/types'
import useSWR from 'swr'

interface useProductPromotionProps {
  key: string
  shouldFetch?: boolean
  product_id: number
}

interface useProducPromotionRes {
  data: PromotionProductItemRes[] | undefined
  isValidating: boolean
}

export const useProductPromotion = ({
  shouldFetch = true,
  key,
  product_id,
}: useProductPromotionProps): useProducPromotionRes => {
  const { data, isValidating } = useSWR(
    key,
    !shouldFetch || !product_id
      ? null
      : () => promotionAPI.getProductPromotion(product_id).then((res) => res?.data?.result),
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
