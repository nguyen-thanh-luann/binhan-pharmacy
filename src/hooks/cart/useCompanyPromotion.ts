import produce from 'immer'
import { useCallback, useMemo } from 'react'
import { useSWRConfig } from 'swr'
import { CartCompany, CartProduct, GetProductsInCartRes, PromotionRes } from '@/types'
import { SWR_KEY } from '@/constants'
import _ from 'lodash'

export type CompanyPromotionProps = {
  company: CartCompany
  companyIndex: number
}

export const useCompanyPromotion = ({ company, companyIndex }: CompanyPromotionProps) => {
  const { cache, mutate } = useSWRConfig()

  const { productsChecked, totalAmount, totalQuantity } = useMemo(() => {
    const productsChecked: CartProduct[] = []
    let totalAmount = 0
    let maxProductPrice = 0
    let maxProductQuantity = 0

    company.shopping_cart_category.forEach((category) => {
      category.shopping_cart_product.forEach((product) => {
        if (product.is_check && product?.product_id?.product_id) {
          if (product.quantity > maxProductQuantity) {
            maxProductQuantity = product.quantity
          }
          if (product.price_unit > maxProductPrice) {
            maxProductPrice = product.price_unit
          }

          totalAmount += product.quantity * product.price_unit
          productsChecked.push(product)
        }
      })
    })

    return {
      productsChecked,
      totalAmount,
      company,
      maxProductPrice,
      maxProductQuantity,
      totalQuantity: company.total_product,
    }
  }, [company])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutateCartSummary = useCallback(
    _.debounce(() => mutate(SWR_KEY.cartSummary), 2000),
    []
  )

  const setPromotionsAppliedToCompany = async (promotions: PromotionRes[]) => {
    const cart: GetProductsInCartRes | undefined = cache.get(SWR_KEY.cart_list)?.data
    if (!cart?.result?.length) return

    const data = produce(cart, (draft) => {
      const company = draft.result?.[companyIndex]
      if (company?.shopping_cart_id) {
        company.promotions_applied = promotions
      }
    })

    mutate(SWR_KEY.cart_list, data, false)
    mutateCartSummary()
  }

  return {
    productsChecked,
    totalAmount,
    totalQuantity,
    setPromotionsAppliedToCompany,
  }
}
