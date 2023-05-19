import { ProductDetail, ProductDetailRes } from '@/types'
import { useSWRConfig } from 'swr'
import { useAsync } from '../common'
import { userAPI } from '@/services'
import { SWR_KEY } from '@/constants'

interface useWhishlistProps {
  key?: string
  shouldFetch?: boolean
}

export const useWishlist = ({}: useWhishlistProps) => {
  const { cache, mutate: mutateProduct } = useSWRConfig()

  const { asyncHandler, isLoading } = useAsync()

  const addWhishlist = async (productDetail: ProductDetail) => {
    asyncHandler({
      fetcher: userAPI.likeProduct(productDetail?.product_id),
      onSuccess: () => {
        mutateProductDetail(true, productDetail?.product_id)
      },
      config: {
        showBackdrop: false,
        showSuccessMsg: false,
        setLoadingState: true
      },
    })
  }

  const deleteWhishlist = async (productDetail: ProductDetail) => {
    asyncHandler({
      fetcher: userAPI.unLikeProduct(productDetail?.product_id),
      onSuccess: () => {
        mutateProductDetail(false, productDetail?.product_id)
      },
      config: {
        showBackdrop: false,
        showSuccessMsg: false,
        setLoadingState: true,
      },
    })
  }

  const mutateProductDetail = (like: boolean, product_id: number) => {
    const key = `${SWR_KEY.get_product_detail}_${product_id}`
    const productDetail: ProductDetailRes = cache.get(key)?.data
    
    mutateProduct(
      key,
      {
        descendants_structor: productDetail.descendants_structor,
        product_data: {
          ...productDetail?.product_data,
          liked: like,
          liked_count: like
            ? (productDetail?.product_data?.liked_count || 0) + 1
            : (productDetail?.product_data?.liked_count || 0) - 1,
        },
      } as ProductDetailRes,
      false
    )
  }

  return {
    addWhishlist,
    deleteWhishlist,
    isLoading,
  }
}
