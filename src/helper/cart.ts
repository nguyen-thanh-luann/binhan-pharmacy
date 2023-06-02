import {
  AppendPromotionsToCart,
  ApplyPromotionOrder,
  CartProduct,
  CategoryDataInApplyCategoryPromotion,
  CompanyDataInGetPromotionApplyOnCompany,
  GetProductsInCartRes,
  GetPromotionValueOrderData,
  GetPromotionsCanApplyFunctionReq,
  IdAndQty,
  MutateCartSummary,
  OrderDraftRes,
  ProductInOrder,
  PromotionOrderLineReq,
  PromotionRange,
  PromotionRes,
} from '@/types'
import produce from 'immer'
import _ from 'lodash'
import { checkAnyKeyInObjectHasValue } from './functions'

export const getProductsCheckedInCart = (
  cart: GetProductsInCartRes | undefined,
  shouldGetCombo = true
): CartProduct[] => {
  if (!cart?.result?.length) return []

  const allProductsChecked: CartProduct[] = []
  const productsChecked: CartProduct[] = []

  cart.result.forEach((item) => {
    item.shopping_cart_category.forEach((category) => {
      category.shopping_cart_product.forEach((product) => {
        if (product.is_check) {
          if (product?.product_id?.product_id) {
            productsChecked.push(product)
          }

          allProductsChecked.push(product)
        }
      })
    })
  })

  return shouldGetCombo ? allProductsChecked : productsChecked
}

export const getCanApplyPromotionParams = (
  cart: GetProductsInCartRes,
  orders: OrderDraftRes[]
): ApplyPromotionOrder[] | undefined => {
  if (!cart?.result?.length || !orders?.length) return

  const promotionsApplied: Omit<ApplyPromotionOrder, 'sale_order_id'>[] = []

  cart.result.forEach((company) => {
    const promotions: PromotionRes[] = []

    if (company?.promotions_applied?.length) {
      promotions.push(...company.promotions_applied)
    }

    company.shopping_cart_category.forEach((category) => {
      if (category?.promotions_category_applied?.length) {
        promotions.push(...category.promotions_category_applied)
      }

      category.shopping_cart_product.forEach((product) => {
        if (product?.promotions_product_applied?.length) {
          promotions.push(...product.promotions_product_applied)
        }
      })
    })

    if (promotions?.length) {
      const promotion_ids: number[] = []
      const promotion_range_ids: number[] = []

      promotions.forEach((item) => {
        promotion_ids.push(item.promotion_id)
        if (item?.selected_range_line?.range_id && item.promotion_type === 'range') {
          promotion_range_ids.push(item.selected_range_line.range_id)
        }
      })

      promotionsApplied.push({
        company_id: company.company_id.company_id,
        promotion_ids,
        promotion_range_ids,
      })
    }
  })

  if (!promotionsApplied?.length) return

  const result: ApplyPromotionOrder[] = promotionsApplied.reduce(
    (acc: ApplyPromotionOrder[], obj) => {
      const order = orders.find((item) => item.company_id === obj.company_id)
      if (order) {
        acc.push({ ...obj, sale_order_id: order.order_id })
      }
      return acc
    },
    []
  )

  return result
}

const getPromotionsFromPromotionValueReq = (promotions: PromotionRes[]) => {
  const ranges = promotions.filter(
    (item) => item?.selected_range_line?.range_id && item.promotion_type === 'range'
  )
  return {
    range_ids: ranges?.length
      ? ranges.map((item) => (item?.selected_range_line as PromotionRange)?.range_id)
      : [],
    promotion_ids: promotions.map((item) => item.promotion_id),
  }
}

export const getPromotionValueReq = (cart: GetProductsInCartRes): GetPromotionValueOrderData[] => {
  const orders: GetPromotionValueOrderData[] = []

  cart.result.forEach((company) => {
    const order: GetPromotionValueOrderData = {
      company_id: company.company_id.company_id,
      order_lines: [],
      promotion_ids: [],
      promotion_range_ids: [],
    }

    const companyPromotions = company?.promotions_applied
    if (companyPromotions?.length) {
      const { promotion_ids, range_ids } = getPromotionsFromPromotionValueReq(companyPromotions)
      order.promotion_ids.push(...promotion_ids)
      order.promotion_range_ids?.push(...range_ids)
    }

    company.shopping_cart_category.forEach((category) => {
      const categoryPromotions = category?.promotions_category_applied
      if (categoryPromotions?.length) {
        const { promotion_ids, range_ids } = getPromotionsFromPromotionValueReq(categoryPromotions)
        order.promotion_ids.push(...promotion_ids)
        order.promotion_range_ids?.push(...range_ids)
      }

      category.shopping_cart_product.forEach((product) => {
        const productPromotions = product?.promotions_product_applied
        if (productPromotions?.length) {
          const { promotion_ids, range_ids } = getPromotionsFromPromotionValueReq(productPromotions)
          order.promotion_ids.push(...promotion_ids)
          order.promotion_range_ids?.push(...range_ids)
        }

        if (product.product_id?.product_id && product.is_check) {
          order.order_lines.push({
            product_id: product.product_id.product_id,
            product_uom_qty: product.quantity,
            uom_id: product.uom_id.uom_id,
            price_unit: product.price_unit,
          })
        }
      })
    })

    if (order.order_lines?.length && order.promotion_ids?.length) {
      orders.push(order)
    }
  })

  return orders
}

export const getOrderDraftProductParams = (
  cart?: GetProductsInCartRes | undefined
): { list_products: ProductInOrder[]; list_combo: IdAndQty[] } | undefined => {
  if (!cart?.result?.length) return

  const list_products: ProductInOrder[] = []
  const list_combo: IdAndQty[] = []

  cart?.result.forEach((company) => {
    const list_product: ProductInOrder = {
      company_id: company.company_id.company_id,
      products: {},
      product_special: [],
      list_combo: [],
    } as ProductInOrder

    company.shopping_cart_category.forEach((category) => {
      category.shopping_cart_product.forEach((product) => {
        if (product.is_check) {
          if (product.combo_id?.combo_id) {
            list_product.list_combo?.push({
              id: product.combo_id.combo_id,
              qty: product.quantity,
            })
            list_combo.push({ id: product.combo_id.combo_id, qty: product.quantity })
          } else {
            if (list_product.products?.[product.product_id.product_id]?.length) {
              list_product.products[product.product_id.product_id]?.push({
                qty: product.quantity,
                uom_id: product.uom_id.uom_id,
                price: product.price_unit,
              })
            } else {
              list_product.products[product.product_id.product_id] = [
                {
                  qty: product.quantity,
                  uom_id: product.uom_id.uom_id,
                  price: product?.price_unit,
                },
              ]
            }
          }
        }
      })
    })

    // company.productsGifted?.forEach((product) => {
    //   list_product.product_special.push({
    //     id: product.id,
    //     id_product: product.id_product,
    //     product_uom: product.uom.id,
    //     quantity: product?.quantity || 1
    //   })
    // })

    list_products.push(list_product)
  })

  const response = [...list_products].filter(
    (item) => checkAnyKeyInObjectHasValue(item.products) || item.list_combo?.length
  )

  if (!response?.length) return

  return { list_products: response, list_combo }
}

export const getTotalCartCategoryMoney = (
  cart: GetProductsInCartRes | undefined,
  company_index: number,
  category_index: number
) => {
  if (!cart?.result) {
    return { amount_total: 0 }
  }

  let amount_total = 0

  cart?.result?.[company_index]?.shopping_cart_category?.[
    category_index
  ]?.shopping_cart_product.forEach((product) => {
    if (product.is_check) {
      amount_total += product.quantity * product.price_unit
    }
  })

  return {
    amount_total,
  }
}

export const sumMoneyAndTotalProductInCart = (cart: GetProductsInCartRes | undefined) => {
  if (!cart?.result) {
    return { totalAmount: 0, totalProduct: 0 }
  }

  let totalAmount = 0
  let totalProduct = 0
  let isLoading = false

  cart.result.forEach((item) => {
    if (!isLoading) {
      isLoading = !!item?.is_promotion_loading
    }

    item?.shopping_cart_category.forEach((category) => {
      if (!isLoading) {
        isLoading = !!item?.is_promotion_loading
      }

      category.shopping_cart_product.forEach((product) => {
        if (!isLoading) {
          isLoading = !!item?.is_promotion_loading
        }

        if (product.is_check) {
          totalProduct += 1
          totalAmount += product.quantity * product.price_unit
        }
      })
    })
  })

  return { totalAmount, totalProduct, isLoading }
}

export const selectPromotionsCanApply = (_promotions: PromotionRes[]) => {
  return _.uniqBy(
    _.sortBy(_.filter(_promotions, { can_apply: true }), (res) => -res.discount_total),
    'promotion_level'
  ).map((promotion) => {
    const ranges = promotion?.range_ids as PromotionRange[]
    if (promotion.promotion_type === 'range' && ranges?.length) {
      return {
        ...promotion,
        selected_range_line: _.maxBy(ranges, 'range_from') || ranges[0],
      }
    } else {
      return promotion
    }
  })
}

export const getPromotionsCanApplyParams = (
  params: MutateCartSummary & { customer_id: number }
): Omit<GetPromotionsCanApplyFunctionReq, 'cart'> | undefined => {
  const {
    cart,
    cart_category_ids,
    shopping_cart_ids,
    shopping_cart_product_ids,
    get_all_products_checked = false,
    customer_id,
  } = params

  const productLines: (PromotionOrderLineReq & { company_id: number })[] = []
  const categoryData: CategoryDataInApplyCategoryPromotion[] = []
  const companyData: CompanyDataInGetPromotionApplyOnCompany[] = []

  cart.result.forEach((company) => {
    const companyParams: CompanyDataInGetPromotionApplyOnCompany = {
      company_id: company.company_id.company_id,
      order_lines: [],
    }

    company.shopping_cart_category.forEach((category) => {
      const categoryParams: CategoryDataInApplyCategoryPromotion = {
        category_id: category.category_id.category_id,
        company_id: company.company_id.company_id,
        order_lines: [],
      }

      category.shopping_cart_product.forEach((product) => {
        if (product.product_id?.product_id && product.is_check) {
          const productLine = {
            product_id: product.product_id.product_id,
            product_uom_qty: product.quantity,
            uom_id: product.uom_id.uom_id,
            price_unit: product.price_unit,
          }

          if (
            product.has_promotion &&
            (get_all_products_checked ||
              shopping_cart_product_ids.includes(product.shopping_cart_product_id))
          ) {
            productLines.push({
              ...productLine,
              company_id: company.company_id.company_id,
            })
          }

          if (
            category.has_promotion &&
            (get_all_products_checked || cart_category_ids.includes(category.cart_category_id))
          ) {
            categoryParams.order_lines.push(productLine)
          }

          if (
            company.has_promotion &&
            (get_all_products_checked || shopping_cart_ids.includes(company.shopping_cart_id))
          ) {
            companyParams.order_lines.push(productLine)
          }
        }
      })

      if (categoryParams.order_lines.length) {
        categoryData.push(categoryParams)
      }
    })

    if (companyParams.order_lines.length) {
      companyData.push(companyParams)
    }
  })

  if (!categoryData?.length && !companyData?.length && !productLines?.length) {
    return undefined
  }

  return {
    categoryParams: categoryData?.length
      ? { customer_id, category_data: categoryData, limit: 8 }
      : undefined,
    companyParams: companyData?.length
      ? { customer_id, order_data: companyData, limit: 8 }
      : undefined,
    productParams: productLines?.length
      ? { customer_id, product_data: productLines, limit: 8 }
      : undefined,
  }
}

export const getCartResultAfterAppendPromotions = ({
  cart,
  companyResult,
  categoryResult,
  productResult,
}: AppendPromotionsToCart): GetProductsInCartRes | undefined => {
  const cartResult = produce(cart, (draft) => {
    draft.result.forEach((company) => {
      company.is_promotion_loading = false

      if (companyResult?.length) {
        const companyPromotions = companyResult?.find(
          (item) => item.company_id === company.company_id.company_id
        )

        if (companyPromotions?.result?.length) {
          company.promotions_applied = selectPromotionsCanApply(companyPromotions.result)
        }
      }

      company.shopping_cart_category.forEach((category) => {
        category.is_promotion_category_loading = false

        if (categoryResult?.length) {
          const categoryPromotions = categoryResult?.find(
            (item) =>
              item.category_id.category_id === category.category_id.category_id &&
              item.company_id === company.company_id.company_id
          )

          if (categoryPromotions?.result?.length) {
            category.promotions_category_applied = selectPromotionsCanApply(
              categoryPromotions.result
            )
          }
        }

        category.shopping_cart_product.forEach((product) => {
          product.is_product_promotion_loading = false

          if (productResult?.length) {
            const productPromotions = productResult?.find(
              (item) =>
                item.product_id.product_id === product.product_id?.product_id &&
                item.company_id === company.company_id.company_id
            )

            if (productPromotions?.result?.length) {
              product.promotions_product_applied = selectPromotionsCanApply(
                productPromotions.result
              )
            }
          }
        })
      })
    })
  })

  return cartResult
}

export const resetPromotionsLoadingInCart = (cart: GetProductsInCartRes) => {
  return produce(cart, (draft) => {
    draft.result.forEach((company) => {
      company.is_promotion_loading = false
      company.shopping_cart_category.forEach((category) => {
        category.is_promotion_category_loading = false
        category.shopping_cart_product.forEach((product) => {
          product.is_product_promotion_loading = false
        })
      })
    })
  })
}

export const getCartResultAfterSetPromotionsLoading = ({
  cart,
  companyParams,
  categoryParams,
  productParams,
}: GetPromotionsCanApplyFunctionReq): GetProductsInCartRes | undefined => {
  const cartResult = produce(cart, (draft) => {
    draft.result.forEach((company) => {
      if (companyParams?.order_data?.length) {
        const companyMatch = companyParams?.order_data.find(
          (item) => item.company_id === company.company_id.company_id
        )
        if (companyMatch) {
          company.is_promotion_loading = true
        }
      }

      company.shopping_cart_category.forEach((category) => {
        if (categoryParams?.category_data?.length) {
          const categoryMatch = categoryParams?.category_data.find(
            (item) => item.category_id === category.category_id.category_id
          )
          if (categoryMatch && categoryMatch.company_id === company.company_id.company_id) {
            category.is_promotion_category_loading = true
          }
        }

        category.shopping_cart_product.forEach((product) => {
          if (productParams?.product_data?.length) {
            const productMatch = productParams?.product_data.find(
              (item) => item.product_id === product?.product_id?.product_id
            )
            if (productMatch && productMatch.company_id === company.company_id.company_id) {
              product.is_product_promotion_loading = true
            }
          }
        })
      })
    })
  })

  return cartResult
}
