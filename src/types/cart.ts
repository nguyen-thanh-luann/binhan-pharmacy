import { CategoryIdName } from './category'
import { ImageId, ImageRes } from './common'
import { HTTPListResponse, Pagination, QueryList } from './http'
import { CompanyIdName, ProductUom, ValueId } from './product'
import {
  CategoryIdAndName,
  GetPromotionApplyOnCategoryReq,
  GetPromotionApplyOnCompany,
  GetPromotionApplyOnCompanyReq,
  GetPromotionApplyOnProduct,
  GetPromotionsAppliedOnProductReq,
  PromotionRes,
} from './promotion'

export interface GetShoppingCartReq extends QueryList {
  limit_category?: number
  limit_product?: number
  category_type?: 'category_major' | 'category_minor'
}

export interface GetCartLengthRes {
  cart_product_count: number
  product_in_cart_count: number
}

//use in useCart hook
export interface DeleteCartProductParams {
  company_id: number
  category_id: number
  cart_product_id: number
}

//use in api's params
export interface DeleteCartProductReq {
  cart_product_ids: number[] | number
  category_type?: 'category_major' | 'category_minor'
}

export interface AddToCartReq {
  company_id: number
  product_id?: number
  uom_id?: number
  combo_id?: number
  quantity?: number
  price_unit?: number
}

export interface AddOrderToCartReq {
  company_id: number
  order_data: Omit<AddToCartReq, 'company_id'>[]
}

export interface AddToCartRes {
  compute_type: 'add' | 'update'
}

export type UpdateCartProductType = 'variant' | 'uom' | 'quantity' | 'price'

export interface UpdateCartItemReq {
  cart_product_id: number
  product_id?: number
  uom_id?: number
  combo_id?: number
  quantity: number
  price_unit: number
  is_check: boolean
}

export type UpdateProduct = MutateProductParams & {
  product: CartProduct
  type: UpdateCartProductType
}

export interface CheckProductsInCartReq {
  shopping_cart_ids?: number[]
  cart_category_ids?: number[]
  is_check: boolean
  category_type?: 'category_major' | 'category_major'
}

export interface DeleteCartProductsReq {
  company_ids?: number[]
  category_ids?: number[]
}

export interface GetProductsInCartReq extends QueryList {
  limit_category?: number
  limit_product?: number
}

export interface GetProductsInCartRes {
  result: CartCompany[]
  paginate: Pagination
  is_check: boolean
  total_company_checked: number
}

export interface GetCartCategoriesInCompanyReq extends QueryList {
  shopping_cart_id: number
  limit_product: number
}

export interface GetCartProductsInCategoryReq extends QueryList {
  cart_category_id: number
}

export interface MutateProductParams {
  companyIndex: number
  categoryIndex: number
  productIndex: number
}

export type GetMoreProductInCategory = Omit<MutateProductParams, 'productIndex'> & {
  category: CartCategory
}

export type GetMoreCategoryInCompany = Pick<MutateProductParams, 'companyIndex'> & {
  company: CartCompany
}

export interface ToggleCheckProduct extends MutateProductParams {
  shopping_cart_product_id: number
}

export interface UpdateCartItemReq {
  cart_product_id: number
  product_id?: number
  uom_id?: number
  combo_id?: number
  quantity: number
  price_unit: number
  is_check: boolean
}

export interface CartProductAttribute {
  attribute: ProductAttributeId
  attribute_value: ValueId
}

export interface CartProductRelAttribute {
  attribute_id: ProductAttributeId
  attribute_value: ValueId[]
}

export interface CartProductAttributeValue extends ProductAttributeId, ValueId {}
export interface ProductAttributeValue extends ProductAttributeId, ValueId {}

export interface ProductAttributeId {
  attribute_id: number
  attribute_name: string
}

export interface RelProduct {
  product_id: number
  product_code: string
  product_name: string
  price_unit: number
  stock: CartProductStock
  representation_image: ImageRes
  attribute_ids: CartProductAttribute[]
}

export type RelProductQty = RelProduct & { quantity: number }

export interface CartProductItem {
  product_id: number
  product_code: string
  product_name: string
  representation_image: ImageRes
  attribute_ids: CartProductAttribute[]
  rel_attribute_ids: CartProductRelAttribute[]
  price_unit: number
  stock: CartProductStock
}

export interface CartComboItem {
  combo_id: number
  combo_name: string
  price_unit: number
  attachment_cloud_id: {
    id: number
    url: string
  }
}

export interface CartProduct {
  shopping_cart_product_id: number
  combo_id: CartComboItem
  product_id: CartProductItem
  rel_product_ids: CartProductItem[]
  uom_id: ProductUom
  rel_uom_ids: ProductUom[]
  quantity: number
  is_check: boolean
  price_unit: number
  attribute_ids: CartProductAttribute[]
  stock: CartProductStock
  price_list: {
    [key: number]: {
      [key: number]: number
    }
  }
  promotions_product_applied?: PromotionRes[]
  is_product_promotion_loading?: boolean
  has_promotion: boolean
}

export interface CartProductStock {
  uom_name: number
  factor: number
  quantity: number
}

export interface CartCategory {
  cart_category_id: number
  category_id: CategoryIdName
  shopping_cart_product: CartProduct[]
  is_check: boolean
  paginate: Pagination
  has_promotion: boolean
  promotions_category_applied?: PromotionRes[]
  is_promotion_category_loading?: boolean
  amount_total: number
}

export interface CartCompany {
  shopping_cart_id: number
  company_id: CompanyIdName
  is_check: boolean
  total_category: number
  total_category_checked: number
  total_product: number
  total_product_checked: number
  paginate_cart_category: Pagination
  shopping_cart_category: CartCategory[]
  has_promotion: boolean
  promotions_applied?: PromotionRes[]
  is_promotion_loading?: boolean
}

export interface GetShoppingCartRes {
  result: CartCompany[]
  paginate: Pagination
  is_check: boolean
  total_company_checked: number
}

export interface ProductAttributeId {
  attribute_id: number
  attribute_name: string
}

export interface CartProductAttributeRes {
  attribute: ProductAttributeId
  attribute_value: ValueId
}

export interface RelProductRes {
  product_id: number
  product_code: string
  product_name: string
  price_unit: number
  stock: CartProductStock
  representation_image: ImageId
  attribute_ids: CartProductAttributeRes[]
}

export type GetPromotionApplyOnCategory = {
  company_id: number
  category_id: CategoryIdAndName
} & HTTPListResponse<PromotionRes[]>

export interface AppendPromotionsToCart {
  cart: GetProductsInCartRes
  companyResult?: GetPromotionApplyOnCompany[] | undefined
  categoryResult?: (GetPromotionApplyOnCategory & { company_id: number })[] | undefined
  productResult?: (GetPromotionApplyOnProduct & { company_id: number })[] | undefined
}

export interface GetPromotionsCanApplyFunctionReq {
  cart: GetProductsInCartRes
  companyParams?: GetPromotionApplyOnCompanyReq
  categoryParams?: GetPromotionApplyOnCategoryReq
  productParams?: GetPromotionsAppliedOnProductReq | undefined
}

export interface MutateCartSummary {
  shopping_cart_ids: number[]
  cart_category_ids: number[]
  shopping_cart_product_ids: number[]
  customer_id: number
  get_all_products_checked?: boolean
  cart: GetProductsInCartRes
}
