import { GetPromotionApplyOnCategory, RelProductRes } from './cart'
import { ImageId } from './common'
import { HTTPListResponse, HTTPResponseDataV2, QueryList } from './http'
import { IdAndName } from './order'

export type PromotionLevel =
  | 'primary_promotion'
  | 'root_promotion'
  | 'space_promotion'
  | 'special_promotion'
export type PromotionType = 'range' | 'bogo_sale' | 'fixed' | 'percentage'
export type LinePromotionType = 'product_added' | 'line_applied' | 'line_promoiton'
export type DiscountType = 'fixed' | 'percentage' | 'same_price' // Đồng giá
export type RangeDiscountType = 'fixed' | 'percentage' | 'free_product'
export type RangeConditionType = 'price' | 'quantity'
export type PromotionAppliedOn = 'product_category' | 'product_template' | 'global'

export interface GetPromotionsReq extends QueryList {
  company_id?: number
  promotion_code?: string
}

export interface GetGlobalPromotionReq extends QueryList {
  campaign_date?: boolean
}

export interface GetCategoryPromotionReq extends QueryList {
  campaign_date?: boolean
  category_id: number
}

export type GetPromotionApplyOnProduct = {
  product_id: RelProductRes
  company_id: number
} & HTTPListResponse<PromotionRes[]>

export type GetProductPromotionSingleRes = HTTPResponseDataV2<GetPromotionApplyOnProduct>

export type GetProductPromotionMultipleRes = HTTPResponseDataV2<GetPromotionApplyOnProduct[]>

export interface PromotionItemRes {
  promotion_id: number
  promotion_code: string
  promotion_name: string
  promotion_type: PromotionType
  promotion_brief: string
  date_start: string
  date_end: string
  promotion_level: PromotionLevel
}

export interface PromotionProductItemRes {
  promotion_level: PromotionLevel
  promotion_id: number
  promotion_code: string
  promotion_name: string
  promotion_type: PromotionType
  promotion_fixed_discount: number
  promotion_percent_discount: number
  promotion_brief: string
  date_start: Date
  date_end: Date
}

export interface GetPromotionsCanApplyOnProductsReq {
  customer_id?: number
  list_product: [
    {
      company_id: number
      product_id: number
    }
  ]
}

export interface PromotionCanApplyRes {
  promotion_level: PromotionLevel
  promotion_id: number
  promotion_code: string
  promotion_name: string
  promotion_type: PromotionType
  promotion_brief: string
  date_start: string
  date_end: string
  duration_start: TimeValue
  duration_end: TimeValue
  promotion_image_url: ImageId
  promotion_banner_url: ImageId
  promotion_value: []
  promotion_line_ids: []
}

export interface CategoryIdAndName {
  category_id: number
  category_name: string
}

export interface UomId {
  uom_id: number
  uom_name: string
  factor: number
}

export interface ApplyPromotionOrder {
  company_id: number
  sale_order_id: number
  promotion_ids: number[]
  promotion_range_ids: number[]
}

export interface ApplyPromotionReq {
  customer_id?: number
  orders: ApplyPromotionOrder[]
}

export interface CancelPromotionReq {
  customer_id?: number
}

export interface PromotionOrderLineReq {
  product_id: number
  uom_id: number
  price_unit?: number
  product_uom_qty: number
}

export type GetPromotionValueOrderData = CompanyDataInGetPromotionApplyOnCompany & {
  promotion_ids: number[]
  promotion_range_ids?: number[]
}

export type GetPromotionValueReq = {
  customer_id: number
  order_data: GetPromotionValueOrderData[]
  only_promotion_total?: boolean
}

export type GetPromotionApplyOnCategoryReq = QueryList & {
  customer_id: number
  category_data: CategoryDataInApplyCategoryPromotion[]
}

export type CategoryDataInApplyCategoryPromotion = {
  company_id: number
  category_id: number
  order_lines: PromotionOrderLineReq[]
}

export type GetPromotionApplyOnCategorySingleRes = HTTPResponseDataV2<GetPromotionApplyOnCategory>

export type GetPromotionApplyOnCategoryMultipleRes = HTTPResponseDataV2<
  GetPromotionApplyOnCategory[]
>

export type CompanyDataInGetPromotionApplyOnCompany = {
  company_id: number
  order_lines: PromotionOrderLineReq[]
}

export type GetPromotionApplyOnCompanyReq = QueryList & {
  customer_id: number
  order_data: CompanyDataInGetPromotionApplyOnCompany[]
}

export type GetPromotionApplyOnCompany = {
  company_id: number
} & HTTPListResponse<PromotionRes[]>

export type GetPromotionApplyOnCompanySingleRes = HTTPResponseDataV2<GetPromotionApplyOnCompany>

export type GetPromotionApplyOnCompanyMultipleRes = HTTPResponseDataV2<GetPromotionApplyOnCompany[]>

export interface GetPromotionValueRes {
  sale_order: {
    sale_order_id: number
    sale_name: number
    partner_id: {
      partner_id: number
      partner_name: string
      phone: string
      gender: string
      avatar_url: ImageId
    }
    company_id: IdAndName
    amount_total: number
  }
  promotion_total: number
  promotion_data: PromotionValueRes[]
}

export interface PromotionValueRes {
  promotion_level: PromotionLevel
  promotion_id: number
  promotion_code: string
  promotion_name: string
  promotion_type: PromotionType
  promotion_brief: string
  date_start: string
  date_end: string
  promotion_line: PromotionValueLineRes[]
}

export interface PromotionValueLineRes {
  line_id: number
  line_name: string
  product_id: {
    product_id: number
    product_code: string
    product_name: string
    representation_image: ImageId
  }
  product_uom_qty: number
  uom_id: {
    uom_id: number
    uom_name: string
    factor: number
  }
  price_unit: number
  tax_id: {
    tax_id: number
    tax_name: string
  }
  price_subtotal: number
  line_promotion_type: LinePromotionType | false
  discount_type: DiscountType
  discount: number
  discount_value: number
  sub_discount_total: number
}

type SpecialTime = {
  is_specific_time: boolean
  time_start: string
  time_end: string
}

type PromotionProcess = {
  used_promo: number
  total_promo: number
}

export type PromotionDetailRes = PromotionItemRes & {
  duration_start: TimeValue
  duration_end: TimeValue
  promotion_image_url: ImageId
  promotion_banner_url: ImageId
  promotion_value: PromotionRange[]
  promotion_applied_on: PromotionAppliedOn
  promotion_applied_product_category_ids: []
  promotion_applied_product_template_ids: [
    {
      promotion_category_id: number
      product_tmpl_id: number
      product_tmpl_name: string
      product_uom_ids: []
    }
  ]
  promotion_applied_product_product_ids: []
  description: string
  special_time: SpecialTime
  promotion_process: PromotionProcess
}

export interface GetPromotionDetailReq {
  promotion_id: number
}

export interface GetPromotionsAppliedOnProductReq extends QueryList {
  customer_id: number
  product_data: (PromotionOrderLineReq & { company_id: number })[]
}

export interface GetListPromotionCanApplyReq extends QueryList {
  customer_id?: number
  sale_order_id: number
}

export interface TimeValue {
  time_value: number
  time_type: string
}

export type PromotionAppliedProductCategoryId = CategoryIdAndName & {
  promotion_category_id: number
}

export interface PromotionAppliedProductTemplateId {
  promotion_category_id: number
  product_tmpl_id: number
  product_tmpl_name: string
  product_uom_ids: number[]
}

export interface GetPromotionDetail {
  promotion_id: number
  promotion_code: string
  promotion_name: string
  promotion_type: PromotionType
  promotion_brief: string
  date_start: string
  date_end: string
  duration_start: TimeValue
  duration_end: TimeValue
  promotion_image_url: ImageId
  promotion_banner_url: ImageId
  promotion_value: PromotionValueRes[]
  promotion_applied_on: PromotionAppliedOn
  promotion_applied_product_category_ids: PromotionAppliedProductCategoryId[]
  promotion_applied_product_template_ids: []
  promotion_applied_product_product_ids: []
  description: string
  special_time: SpecialTime
  promotion_process: PromotionProcess
}

export interface GetPromotionsCanApplyReq extends QueryList {
  sale_order_id: number
}

export interface PromotionRangeLineProduct {
  range_free_product_id: {
    product_id: number
    product_code: string
    product_name: string
    representation_image: ImageId
    attribute_ids: []
    price_unit: number
    sold_quantity: number
    company_id: false
    uom_id: number
    attribute_minor_ids: []
  }
  range_free_uom_id: UomId
  range_free_quantity: number
}

export type PromotionRangeLine = {
  range_line_id: number
  range_discount_type: RangeDiscountType
  range_discount_value?: number
} & Partial<PromotionRangeLineProduct>

export interface PromotionRange {
  range_id: number
  range_name: string
  range_discount_type: RangeDiscountType
  range_from: number
  range_to: number
  range_condition_type: RangeConditionType
  range_free_product_id?: {
    product_id: number
    product_code: string
    product_name: string
    representation_image: ImageId
    attribute_ids: []
    price_unit: number
    sold_quantity: number
    company_id: false
    uom_id: number
    attribute_minor_ids: []
  }
  range_free_uom_id?: UomId
  range_free_quantity?: number
  range_line_ids?: PromotionRangeLine[]
}

export type PromotionValueUnitRes = { value: number; unit: string }

export interface PromotionFreeProduct {
  product_id: number
  product_name: string
  representation_image: ImageId
  uom_id: {
    uom_full_standard_name: string
    uom_id: number
    uom_name: string
    factor: number
  }
  attribute_ids: []
  quantity: number
}

export interface PromotionRes extends PromotionItemRes {
  can_apply: boolean
  selected_range_line?: PromotionRange | null
  active?: boolean
  discount_total: number
  duration_start: TimeValue
  duration_end: TimeValue
  promotion_image_url: ImageId
  promotion_banner_url: ImageId
  promotion_line: any
  range_ids: PromotionValueUnitRes | PromotionRange[]
  promotion_applied_on: PromotionAppliedOn
  promotion_applied_product_category_ids: PromotionAppliedProductCategoryId[]
  promotion_applied_product_template_ids: PromotionAppliedProductTemplateId[]
  promotion_applied_product_product_ids: []
  description: string
  special_time: SpecialTime
  promotion_process: PromotionProcess
  free_product?: PromotionFreeProduct[]
}

export type PromotionOrderRes = PromotionItemRes & {
  promotion_total: number
  range_line: PromotionRange
  free_product: PromotionFreeProduct[]
}
