import { DEFAULT_LIMIT } from '@/constants'
import {
  AddOrderToCartReq,
  AddToCartReq,
  AddToCartRes,
  CartCategory,
  CartProduct,
  CheckProductsInCartReq,
  DeleteCartProductReq,
  DeleteCartProductsReq,
  GetCartCategoriesInCompanyReq,
  GetCartLengthRes,
  GetCartProductsInCategoryReq,
  GetShoppingCartReq,
  GetShoppingCartRes,
  HTTPResponseDataV2,
  HTTPResponseV2,
  UpdateCartItemReq,
} from '@/types'
import axiosClient from '.'

const cartAPI = {
  getCartLength: (): Promise<HTTPResponseDataV2<GetCartLengthRes>> => {
    return axiosClient.get('/shopping_cart_controller/quantity_product_in_shopping_cart')
  },

  getShoppingCart: ({
    limit = DEFAULT_LIMIT,
    offset = 0,
    ...params
  }: GetShoppingCartReq): Promise<HTTPResponseDataV2<GetShoppingCartRes>> => {
    return axiosClient.get('/shopping_cart_controller/list_product_in_cart', { params })
  },

  addGuestCartDataIntoShoppingCart: (device_code: string) => {
    return axiosClient.get(
      `/shopping_cart_controller/add_guest_data_into_shopping_cart?device_code=${device_code}`
    )
  },

  deleteCartProduct: (params: DeleteCartProductReq): Promise<HTTPResponseV2<[]>> => {
    return axiosClient.post(`/shopping_cart_controller/delete_quantity_product_in_cart`, {
      params: params,
    })
  },

  deleteCartProducts: (params: DeleteCartProductsReq): Promise<HTTPResponseV2<[]>> => {
    return axiosClient.delete(`/shopping_cart_controller/delete_all_product_in_cart`, {
      params: params,
    })
  },

  addToCart: (params: AddToCartReq): Promise<HTTPResponseV2<AddToCartRes>> => {
    return axiosClient.post(`/shopping_cart_controller/add_product_into_shopping_cart`, {
      params: params,
    })
  },

  addOrderToCart: (params: AddOrderToCartReq): Promise<HTTPResponseV2<AddToCartRes>> => {
    return axiosClient.post(`/shopping_cart_controller/add_order_into_shopping_cart`, {
      params: params,
    })
  },

  getCartCategoriesInCompany: (
    params: GetCartCategoriesInCompanyReq
  ): Promise<HTTPResponseV2<CartCategory[]>> => {
    return axiosClient.get(
      `/shopping_cart_controller/list_category_minor_in_company?${
        params?.shopping_cart_id ? `&shopping_cart_id=${params?.shopping_cart_id}` : ''
      }${params?.limit_product ? `&limit_product=${params.limit_product}` : ''}`
    )
  },

  getCartProductsInCategory: (
    params: GetCartProductsInCategoryReq
  ): Promise<HTTPResponseV2<CartProduct[]>> => {
    return axiosClient.get(`/shopping_cart_controller/list_product_in_category_minor`, { params })
  },

  updateCartItem: (params: UpdateCartItemReq): Promise<HTTPResponseV2<CartProduct>> => {
    return axiosClient.post(`/shopping_cart_controller/update_quantity_product_in_cart`, {
      params: params,
    })
  },

  toggleCheckProductsInCart: (
    params: CheckProductsInCartReq
  ): Promise<HTTPResponseV2<CartProduct>> => {
    return axiosClient.post(`/shopping_cart_controller/check_all_product_in_cart`, {
      params: params,
    })
  },
}

export { cartAPI }
