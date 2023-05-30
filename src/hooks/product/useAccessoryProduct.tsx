import { productAPI } from '@/services'
import { Product, ProductParams } from '@/types'
import { useQueryListV2 } from '../common/useQueryV2'

interface useProductQueryProps {
  key: string
  params: ProductParams
}

interface useProductQueryRes {
  products: Product[]
  isLoadingMore: boolean
  hasMore: boolean
  isValidating: boolean
  filter: (params: ProductParams) => void
  getMore: () => void
}

export const useAccessoryProduct = ({ key, params }: useProductQueryProps): useProductQueryRes => {
  
  const { data, isValidating, getMore, hasMore, isLoadingMore, filter } = useQueryListV2<
    Product,
    ProductParams
  >({
    key,
    fetcher: productAPI.getAccessoryProduct,
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
