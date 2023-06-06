import { productAPI } from '@/services'
import { ProductDescription } from '@/types'
import useSWR from 'swr'

interface useProductDescriptionProps {
  key: string
  product_id: number
  shouldFetch?: boolean
}

interface useProducDescriptionRes {
  data: ProductDescription[] | undefined
  isValidating: boolean
}

export const useProductDescription = ({
  shouldFetch = true,
  key,
  product_id,
}: useProductDescriptionProps): useProducDescriptionRes => {
  const { data, isValidating } = useSWR(
    key,
    !shouldFetch
      ? null
      : () => productAPI.getProductDescription(product_id).then((res: any) => res?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  )

  return {
    data,
    isValidating,
  }
}
