import { productAPI } from '@/services'
import { FilterProductParams, Product } from '@/types'
import { useQueryListV2 } from '../common/useQueryV2'

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
}

export const useProductQuery = ({ key, params }: useProductQueryProps): useProductQueryRes => {
  const { data, isValidating, getMore, hasMore, isLoadingMore, filter } = useQueryListV2<
    Product,
    FilterProductParams
  >({
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
  }
}
