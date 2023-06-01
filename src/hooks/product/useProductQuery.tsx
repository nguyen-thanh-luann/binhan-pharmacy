import { productAPI } from '@/services'
import { FilterProductParams, Product } from '@/types'
import { useProductFilter } from '../common/useProductFilter'

interface useProductQueryProps {
  key: string
  params: FilterProductParams
}

interface useProductQueryRes {
  products: Product[]
  isLoadingMore: boolean
  hasMore: boolean
  isValidating: boolean
  filter: (params: FilterProductParams) => void
  getMore: () => void
  price_max: number
  price_min: number
}

export const useProductQuery = ({ key, params }: useProductQueryProps): useProductQueryRes => {
  const { data, isValidating, getMore, hasMore, isLoadingMore, filter, price_max, price_min } =
    useProductFilter<Product, FilterProductParams>({
      key,
      fetcher: productAPI.filterProduct,
      initialParams: params,
      config: {
        revalidateOnFocus: false,
        dedupingInterval: 60000,
      },
    })

  return {
    products: data,
    isLoadingMore,
    isValidating,
    hasMore,
    getMore,
    filter,
    price_max,
    price_min,
  }
}
