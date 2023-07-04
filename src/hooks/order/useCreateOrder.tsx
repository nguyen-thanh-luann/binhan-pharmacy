import { SWR_KEY } from '@/constants'
import { checkAnyKeyInObjectHasValue, getCanApplyPromotionParams } from '@/helper'
import { orderAPI, promotionAPI } from '@/services'
import { setBackdropVisible } from '@/store'
import {
  GetProductsInCartRes,
  GetShoppingCartRes,
  IdAndQty,
  OrderDraftRes,
  ProductInOrder,
  UpdateOrderHook,
} from '@/types'
import { useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import { useAsync } from '../common'
import { useUser } from '../user'

export const useCreateOrder = () => {
  const { asyncHandler } = useAsync()
  const dispatch = useDispatch()
  const { userInfo } = useUser({ shouldFetch: true })
  const customer_id = userInfo?.account?.partner_id

  const { data: shoppingcart } = useSWR<GetShoppingCartRes>(SWR_KEY.cart_list)
  const totalCount = useMemo(() => {
    if (!shoppingcart?.result) return { totalMoney: 0, totalProduct: 0 }

    let totalMoney = 0
    let totalProduct = 0
    shoppingcart.result.forEach((item) => {
      item?.shopping_cart_category.forEach((category) => {
        category.shopping_cart_product.forEach((product) => {
          if (product.is_check) {
            totalProduct += 1
            totalMoney += product.quantity * product.price_unit
          }
        })
      })
    })
    return { totalMoney, totalProduct }
  }, [shoppingcart?.result])

  const getOrderDraftProductParams = ():
    | { list_products: ProductInOrder[]; list_combo: IdAndQty[] }
    | undefined => {
    if (!shoppingcart?.result?.length) return

    const list_products: ProductInOrder[] = []
    const list_combo: IdAndQty[] = []

    shoppingcart?.result.forEach((company) => {
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
              list_product?.list_combo?.push({
                id: product.combo_id.combo_id,
                qty: product.quantity,
              })
              list_combo.push({ id: product.combo_id.combo_id, qty: product.quantity })
            } else {
              if (list_product.products?.[product.product_id.product_id]?.length) {
                ;(list_product as any).products?.[product.product_id.product_id].push({
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

      list_products.push(list_product)
    })

    const response = [...list_products].filter(
      (item) => checkAnyKeyInObjectHasValue(item.products) || item.list_combo?.length
    )

    if (!response?.length) return

    return { list_products: response, list_combo }
  }

  const applyPromotionOnSaleOrders = async (saleOrders: OrderDraftRes[]) => {
    const orders = getCanApplyPromotionParams(shoppingcart as GetProductsInCartRes, saleOrders)
    if (!orders) {
      dispatch(setBackdropVisible(false))
      return
    }

    try {
      await promotionAPI.applyPromotion({ orders, customer_id })
      dispatch(setBackdropVisible(false))
    } catch (error) {
      dispatch(setBackdropVisible(false))
    }
  }

  const createOrderDraft = async (onSuccess?: (orders: OrderDraftRes[]) => void) => {
    const productParams = getOrderDraftProductParams()
    if (!productParams) {
      toast.error('Vui lòng chọn sản phẩm để tiếp tục')
      return
    }
    const { list_combo, list_products } = productParams

    dispatch(setBackdropVisible(true))
    asyncHandler({
      fetcher: orderAPI.createOrderDraft({
        api_version: '2.1',
        customer_id: customer_id as number,
        list_products,
        list_combo,
      }),
      onSuccess: async (res: any) => {
        if (res?.sale_orders?.length) {
          await applyPromotionOnSaleOrders(res.sale_orders)
          onSuccess?.(res.sale_orders || [])
        } else {
          dispatch(setBackdropVisible(false))
          toast.error('Tạo đơn hàng thất bại, vui lòng thử lại sau')
        }
      },
      onError: () => dispatch(setBackdropVisible(false)),
      config: {
        errorMsg: 'Tạo đơn hàng thất bại, vui lòng thử lại sau',
        showSuccessMsg: false,
        showBackdrop: false,
      },
    })
  }

  const updateOrderDraft = async (props: UpdateOrderHook) => {
    const { handleSuccess, params } = props
    const { acquirer_id, order_id, partner_shipping_id } = params

    asyncHandler({
      fetcher: orderAPI.updateOrderDraft({
        order_id: order_id,
        partner_shipping_id: partner_shipping_id || null,
        acquirer_id: acquirer_id || null,
      }),
      onSuccess: (res) => {
        handleSuccess?.(res)
      },
      config: { showSuccessMsg: false },
    })
  }

  return {
    createOrderDraft,
    getOrderDraftProductParams,
    updateOrderDraft,
    ...totalCount,
  }
}
