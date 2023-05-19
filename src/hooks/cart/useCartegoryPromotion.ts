import { SWR_KEY } from '@/constants'
import { CartCategory, CartProduct, GetProductsInCartRes, PromotionRes } from '@/types'
import produce from 'immer'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { useSWRConfig } from 'swr'

type Props = {
  category: CartCategory
  companyId: number
  companyIndex: number
  categoryIndex: number
}

export const useCategoryPromotion = ({ category, categoryIndex, companyIndex }: Props) => {
  const { cache, mutate } = useSWRConfig()

  const { productsChecked, totalProduct, totalAmount } = useMemo(() => {
    if (!category?.cart_category_id) {
      return {
        productsChecked: [],
        totalAmount: 0,
        totalProduct: 0,
      }
    }
    const productsChecked: CartProduct[] = []
    let totalAmount = 0

    category.shopping_cart_product.forEach((item) => {
      if (item.is_check) {
        totalAmount += item.quantity * item.price_unit
        productsChecked.push(item)
      }
    })

    return {
      productsChecked,
      totalAmount,
      totalProduct: category?.shopping_cart_product?.length,
    }
  }, [category])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutateCartSummary = useCallback(
    _.debounce(() => mutate(SWR_KEY.cartSummary), 2000),
    []
  )

  const setPromotionsAppliedOnCategory = async (promotions: PromotionRes[]) => {
    const cart: GetProductsInCartRes | undefined = cache.get(SWR_KEY.cart_list)?.data
    if (!cart?.result?.length) return

    const data = produce(cart, (draft) => {
      const category = draft.result?.[companyIndex]?.shopping_cart_category?.[categoryIndex]
      if (category?.cart_category_id) {
        category.promotions_category_applied = promotions
      }
    })

    mutate(SWR_KEY.cart_list, data, false)
    mutateCartSummary()
  }

  return {
    totalAmount,
    totalProduct,
    productsChecked,
    setPromotionsAppliedOnCategory,
  }
}
