import { SWR_KEY } from '@/constants'
import { cartAPI } from '@/services'
import { AddToCartReq, AddToCartRes, Product } from '@/types'
import { toast } from 'react-hot-toast'
import { useSWRConfig } from 'swr'
import { useAsync } from '../common'
import { useUser } from '../user'

export const useAddToCart = () => {
  const { userInfo } = useUser({})
  const userCompany = userInfo?.account?.company_id || 1
  const { asyncHandler, isLoading } = useAsync()
  const { mutate: swrConfigMutate } = useSWRConfig()

  const addToCart = (product: Product, onSuccess?: () => void, onError?: () => void) => {
    const params: AddToCartReq = {
      company_id: product?.company_id || userCompany,
      product_id: product.product_id,
      price_unit: product?.price_unit || 0,
      quantity: product?.quantity || 1,
      uom_id: product.uom_id?.uom_id || 0,
    }

    asyncHandler({
      fetcher: cartAPI.addToCart(params),
      onSuccess: (res: AddToCartRes) => {
        onSuccess?.()
        swrConfigMutate(SWR_KEY.cart_list)
        if (res?.compute_type === 'add') {
          //increase cart length
          swrConfigMutate(SWR_KEY.cart_count)
          toast.success('Thêm vào giỏ hàng thành công!')
        } else {
          toast.success('Cập nhật giỏ hàng thành công!')
        }
      },
      onError: () => {
        onError?.()
      },
      config: {
        showSuccessMsg: false,
        setLoadingState: true,
        showBackdrop: false,
      },
    })
  }

  return {
    isAddingTocart: isLoading,
    addToCart,
  }
}
