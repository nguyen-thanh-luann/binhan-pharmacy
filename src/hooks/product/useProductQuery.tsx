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
  isFilter: boolean
  hasMore: boolean
  isValidating: boolean
  filter: (params: FilterProductParams) => void
  paginate: (params: FilterProductParams) => void
  getMore: () => void
  price_max: number
  price_min: number
  total: number
  limit: number
  offset: number
}

export const useProductQuery = ({ key, params }: useProductQueryProps): useProductQueryRes => {
  const {
    data,
    isValidating,
    getMore,
    hasMore,
    isLoadingMore,
    isFilter,
    filter,
    price_max,
    price_min,
    total,
    limit,
    offset,
    paginate,
  } = useProductFilter<Product, FilterProductParams>({
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
    isFilter,
    isValidating,
    hasMore,
    getMore,
    filter,
    paginate,
    price_max,
    price_min,
    total,
    limit,
    offset,
  }
}
