import { URLRes } from './common'
import { QueryList } from './http'
import { PromotionOrderRes } from './promotion'
import { UserGenderType } from './user'

export interface IdAndQty {
  id: number
  qty: number
}

export interface ProductSpecial {
  id: number
  id_product: number
  product_uom: number
  quantity: number
}

export interface ProductInOrder {
  company_id: number
  coupon_code?: string
  payment_term_id?: number
  products: { [key: number]: { qty: number; uom_id: number; price?: number }[] }
  list_combo?: IdAndQty[]
  product_special: ProductSpecial[]
}

export interface CreateDraftOrderReq {
  api_version: '2.1'
  partner_shipping_id?: number
  appointment_time?: string
  coupon_code?: string
  customer_id: number
  image?: string | null
  latitude?: string | null
  longitude?: string | null
  list_combo?: { id: number; qty: number }[]
  list_products: ProductInOrder[]
  loyalty_point?: number
  note?: string
  order_id?: number | null
}

export interface GetOrderDraftRes {
  sale_orders: OrderDraftRes[]
  amount_total: number
}

export interface OrderDraftRes {
  order_id: number
  company_id: number
  company_name: string
  detail_order: {
    id: number
    promotion_code: string
    partner_id: number
    combo_id: []
    order_line: DraftOrderLine[]
    shipping_fee: number
    amount_untaxed: number
    amount_tax: number
    reduce_price_combo_view: number
    amount_total: number
  }
  shipping_fee: number
  amount_untaxed: number
  amount_tax: number
  reduce_price_combo_view: number
  discount_by_loyal: number
  amount_total: number
  delivery_selected?: DeliveryMethodRes
  discount: PromotionOrderRes[]
  promotion_total: number
  amount_subtotal: number
  category_minor_promotion: OrderDraftCategoryMinorPromotion[]
}

export interface OrderDraftCategoryMinorPromotion {
  category_id: number
  category_name: string
  category_icon: URLRes
  percent: number
  promotion_total: number
}

export interface DraftOrderLine {
  id: number
  product_id: number
  type: ProductType
  name: string
  quantity: number
  image: string
  product_uom: string
  price_unit: number
  product_discount: number
  discount_line: {
    type: 'percent'
    value: number
  }
  price: number
  discount_price: number
  attributes: OrderProductAttribute[]
}

export interface OrderProductAttribute {
  id: number
  name: string
  value_id: number
  value_name: string
}

export interface CreateOrderDoneReq {
  image?: string
  longitude?: string
  latitude?: string
  order_id: number[]
  note?: string
  tag_ids?: number[]
  date_order?: string
}

export interface UpdateOrderDraft {
  order_id: Array<number>
  partner_shipping_id?: number | null
  acquirer_id?: number | null
}

export type createOrderDoneFunction = Pick<CreateOrderDoneReq, 'note' | 'date_order'> & {
  delivery?: SelectedDelivery[]
  tag_ids?: IdAndName[]
}

export type CreateOrderDoneWithTransactionConfirmedFunction = Pick<
  CreateOrderDoneReq,
  'note' | 'date_order' | 'order_id'
> & {
  delivery?: SelectedDelivery[]
  tag_ids?: IdAndName[]
}

export interface SelectedDelivery extends DeliveryMethodRes {
  company_id: number
  order_id: number
}

export interface GetDeliveryMethodsReq {
  sale_id: number
}

export interface DeliveryMethodRes {
  carrier_name: string
  carrier_id: number
  shipping_fee: number
  shipping_active: boolean
  shipping_icon: string
  description: string
}

export interface GetStatusOrderRes {
  state: {
    all: 'Tất cả'
    draft: 'Báo giá'
    sale: 'Xác nhận'
    done: 'Hoàn Thành'
    cancel: 'Đã hủy'
    delivery: 'Đang giao'
    received: 'Đã giao'
    paid: 'Thanh toán'
    refund: 'Trả hàng'
  }
  delivery_status: {
    all: 'Tất cả'
    no_name: 'Chưa giao hàng'
    partially_delivered: 'Giao một phần'
    fully_delivered: 'Đã giao hết'
  }
  return_delivery_status: {
    all: 'Tất cả'
    no_name: 'Không'
    return_partially_delivered: 'Trả hàng một phần'
    return_fully_delivered: 'Trả hàng toàn bộ'
  }
  paid_status: {
    all: 'Tất cả'
    no_paid: 'Chưa thanh toán'
    partially_paid: 'Thanh toán một phần'
    fully_paid: 'Thanh toán toàn bộ'
  }
  return_paid_status: {
    all: 'Tất cả'
    no_paid: 'Không'
    return_fully_paid: 'Hoàn tiền toàn phần'
    return_partially_paid: 'Hoàn tiền một phần'
  }
}

export interface ConfirmDeliveryMethodReq {
  sale_carrier: {
    sale_id: number
    carrier_id: number
    delivery_price: number
  }[]
  required_note: string
  payment_type: string
  delivery_message: string
}

export interface ConfirmDeliveryMethodRes {}

export interface IdAndName {
  id: number
  name: string
}
export type ProductType = 'product' | 'combo'

export interface Delivery {
  carrier_id: number
  carrier_name: string
  shipping_fee: number
  shipping_active: boolean
  shipping_icon: string
  description: string
  note?: string
}

export interface OrderLineDelivery extends Delivery {
  company_id?: number
}

export interface CreatePaymentParams {
  acquirer_id: number
  sale_order_id: number
  returned_url: string
}

export interface ConfirmTransactionParams {
  sale_order_id: number
}

export interface Payment {
  acquirer_id: number
  name: string
  provider: string
  state: string
  image_url: string
}

export interface UpdateOrderHook {
  handleSuccess?: Function
  params: {
    partner_shipping_id?: number
    acquirer_id?: number
    company_id?: number
    order_id: number[]
  }
}

export interface SaleOrderId {
  sale_order_id: number
}

export interface OrderHistory {
  sell_by: string
  coupon_code: string | boolean
  amount_total: number
  order_id: number
  partner_id: number
  name: string
  create_date: string
  state: string
  state_name: string
  state_paid_name_name: string
  state_delivery_name: string
  state_paid_name: string
  state_return_delivery: string
  state_return_paid: string
  note: string
  delivery_message: string
  // v3.0
  partner_name: string
  company_id: 1
  company_name: string
  state_view: {
    name: string
    value: string
  }
  state_delivery: string
  state_paid: string
  state_return_delivery_name: string
  state_return_paid_name: string
  product: ProductOrderHistory[]
}

export interface OrderHistoryDetail {
  amount_total: number
  create_date: string
  customer_location: { longitude: string; latitude: string }
  delivery_address: string
  delivery_name: string
  delivery_phone: string
  discount_by_loyal: number
  is_rate: string
  name: string
  note: string
  partner_address: string
  partner_id: number
  partner_name: string
  partner_phone: string
  products: ProductOrderHistory[]
  discount?: PromotionOrderRes[]
  sell_by: string
  star: number
  state: string
  state_delivery_name: string
  state_name: string
  state_paid_name: string
  state_return_delivery: string
  state_return_paid: string
  type_product: string
  code_delivery: string | false
  url_tracking_delivery: string | false
  delivery_message: string
  payment_method: OrderPaymentMethod
  category_minor_promotion: OrderDraftCategoryMinorPromotion[]
}

export interface OrderPaymentMethod {
  payment_id: number
  payment_name: string
  payment_type: 'bank' | 'cod' | 'other'
  payment_info: {
    qr_code: string
    bank_name: string
    bank_code: string
    bank_branch: string
    bank_account_holder: string
    bank_note: string
  }
}

export interface ProductOrderHistory {
  image_url: Array<string>
  name: string
  price: number
  product_discount: number
  product_id: number
  product_uom: string
  quantity: number
  re_order: boolean
}

export interface OrderFilterParams extends QueryList {
  booking_type?: string
  booking_state?: string
  date_starting?: string
  date_ending?: string
}

export interface CreateOrderDoneRes {
  sale_order_id: OrderDoneRes[]
}

export interface OrderDoneRes {
  sale_order_id: number
  amount_total: number
  name: string
}

export interface OrderStatusRes {
  state: OrderState
  delivery_status: OrderDeliveryStatus
  return_delivery_status: OrderReturnDeliveryStatus
  paid_status: OrderPaidStatus
  return_paid_status: OrderReturnPaidStatus
}

export interface OrderState {
  all: string
  draft: string
  sale: string
  done: string
  cancel: string
  delivery: string
  received: string
  paid: string
  refund: string
}

export interface OrderDeliveryStatus {
  all: string
  no_name: string
  partially_delivered: string
  fully_delivered: string
}

export interface OrderReturnDeliveryStatus {
  all: string
  no_name: string
  return_partially_delivered: string
  return_fully_delivered: string
}

export interface OrderPaidStatus {
  all: string
  no_paid: string
  partially_paid: string
  fully_paid: string
}

export interface OrderReturnPaidStatus {
  all: string
  no_name: string
  return_fully_paid: string
  return_partially_paid: string
}

export interface CreateOpportunityParams {
  has_medicine_order: boolean
  request_type: 'purchase' | 'advice'
  gender?: UserGenderType
  contact_name: string
  phone: string
  drugstore_id?: number
  country_id?: number
  province_id?: number
  district_id?: number
  ward_id?: number
  street?: string
  note?: string
  medical_order_image_url?: number[]
  order_line?: ProductLineOpportunityParams[]
}

export interface ProductLineOpportunityParams {
  product_id?: number
  product_uom?: number
  quantity?: number
  price_unit?: number
}
