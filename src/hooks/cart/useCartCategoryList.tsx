import { LIMIT_PRODUCT_IN_CATEGORY, SWR_KEY } from '@/constants'
import { cartAPI } from '@/services'
import { GetMoreProductInCategory, GetProductsInCartRes } from '@/types'
import produce from 'immer'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { useUser } from '../user'
import { useApplyPromotionToCart } from './useApplyPromotionToCart'

export const useCartCategoryList = () => {
  const { cache, mutate } = useSWRConfig()
  const { userInfo } = useUser({})

  const [categoryLoadingId, setCategoryLoadingId] = useState<number | undefined>(0)
  const { applyPromotionsToCart } = useApplyPromotionToCart()

  const getMoreProductsInCategory = async ({
    categoryIndex,
    companyIndex,
    category,
  }: GetMoreProductInCategory) => {
    const cart: GetProductsInCartRes = cache.get(SWR_KEY.cart_list)?.data

    const { limit, offset, total } = category.paginate

    if (!cart?.result?.length || category.shopping_cart_product.length >= total) return

    try {
      setCategoryLoadingId(category.cart_category_id)

      const res = await cartAPI.getCartProductsInCategory({
        cart_category_id: category.cart_category_id,
        limit: LIMIT_PRODUCT_IN_CATEGORY,
        offset: offset + limit,
      })

      setCategoryLoadingId(undefined)

      const { paginate, result } = res.data
      if (!result?.length) return

      const cartResult = produce(cart, (draft: any) => {
        const category: any = draft?.result[companyIndex].shopping_cart_category[categoryIndex]

        category.paginate = paginate
        category.shopping_cart_product.push(...result)
      })

      mutate(SWR_KEY.cart_list, cartResult, false)

      if (!userInfo?.account?.partner_id || !(cart as any).result[companyIndex].is_check) return

      const products = result?.filter((product) => product.has_promotion)
      if (products?.length) {
        await applyPromotionsToCart({
          cart_category_ids: [category.cart_category_id],
          shopping_cart_ids: [],
          shopping_cart_product_ids: products.map((item) => item.shopping_cart_product_id),
          customer_id: userInfo?.account.partner_id,
        })
      }
    } catch (error) {
      console.log('catch error', error)
      setCategoryLoadingId(undefined)
    }
  }

  return {
    categoryLoadingId,
    getMoreProductsInCategory,
  }
}
