import _ from 'lodash'
import { useSWRConfig } from 'swr'
import {
  getCartResultAfterAppendPromotions,
  getCartResultAfterSetPromotionsLoading,
  getPromotionsCanApplyParams,
  resetPromotionsLoadingInCart,
} from '@/helper'
import { promotionAPI } from '@/services'
import {
  GetProductsInCartRes,
  GetPromotionApplyOnCategory,
  GetPromotionApplyOnCompany,
  GetPromotionApplyOnProduct,
  GetPromotionsCanApplyFunctionReq,
  MutateCartSummary,
} from '@/types'
import { SWR_KEY } from '@/constants'

export const useApplyPromotionToCart = () => {
  const { mutate, cache } = useSWRConfig()

  const getCartData = (): GetProductsInCartRes | undefined => cache.get(SWR_KEY.cart_list)?.data

  const promotionsApplyToCartFetcher = async ({
    categoryParams,
    companyParams,
    productParams,
  }: Omit<GetPromotionsCanApplyFunctionReq, 'cart'>) => {
    return await Promise.all(
      [
        productParams ? promotionAPI.getPromotionsCanApplyOnProducts(productParams) : null,
        categoryParams ? promotionAPI.getPromotionsApplyOnCategory(categoryParams) : null,
        companyParams ? promotionAPI.getPromotionsAppyOnCompany(companyParams) : null,
      ].map(async (item) => {
        if (!item) return null
        const data = (await item).data
        return !_.isArray(data) ? [data] : data
      })
    )
  }

  const applyPromotionsToCart = async (params: Omit<MutateCartSummary, 'cart'>) => {
    const { customer_id, ...rest } = params
    const cart = getCartData()
    if (!customer_id || !cart?.result?.length) return
    const promoCanApplyParams = getPromotionsCanApplyParams({
      ...rest,
      cart,
      customer_id,
    })

    if (!promoCanApplyParams) {
      mutate(SWR_KEY.cartSummary)
      return
    }

    mutate(
      SWR_KEY.cart_list,
      getCartResultAfterSetPromotionsLoading({ ...promoCanApplyParams, cart }),
      false
    )

    try {
      const response = await promotionsApplyToCartFetcher(promoCanApplyParams)
      if (!response) return

      // Phải lấy lại dữ liệu của cart mới nhất vì trên nó là 1 Promise (nếu vẫn lấy data ở trên kia thì dữ liệu sẽ không được đúng nữa)
      const cart = getCartData()
      if (!cart?.result?.length) return

      const [productResult, categoryResult, companyResult] = response

      const cartResult = getCartResultAfterAppendPromotions({
        cart,
        productResult: productResult as GetPromotionApplyOnProduct[],
        categoryResult: categoryResult as GetPromotionApplyOnCategory[],
        companyResult: companyResult as GetPromotionApplyOnCompany[],
      })

      if (cartResult) {
        mutate(SWR_KEY.cart_list, cartResult, false)
        mutate(SWR_KEY.cartSummary)
      }
    } catch (error) {
      const cart = getCartData()

      console.log({ cart })

      if (cart?.result?.length) {
        mutate(SWR_KEY.cart_list, resetPromotionsLoadingInCart(cart), false)
      }
      console.log('PROMOTION APPLY FAILED: ', error)
    }
  }

  return { applyPromotionsToCart }
}
