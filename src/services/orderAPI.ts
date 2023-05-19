import {
  ConfirmDeliveryMethodReq,
  ConfirmDeliveryMethodRes,
  ConfirmTransactionParams,
  CreateDraftOrderReq,
  CreateOpportunityParams,
  CreateOrderDoneReq,
  CreateOrderDoneRes,
  CreatePaymentParams,
  DeliveryMethodRes,
  GetDeliveryMethodsReq,
  GetOrderDraftRes,
  GetStatusOrderRes,
  HTTPResponse,
  HTTPResultResponse,
  IdAndName,
  OrderDraftRes,
  OrderFilterParams,
  OrderHistoryDetail,
  SaleOrderId,
  UpdateOrderDraft,
} from '@/types'
import axiosClient from '.'
import { AxiosResponse } from 'axios'

const orderAPI = {
  createOrderDraft: (
    params: CreateDraftOrderReq
  ): Promise<HTTPResponse<{ sale_orders: OrderDraftRes[] }>> => {
    return axiosClient.post('/api/v2.0/order/order_draft', {
      params: params,
    })
  },

  getOrderDrafts: (params: { order_ids: number[] }): Promise<HTTPResponse<GetOrderDraftRes>> => {
    return axiosClient.post('/api/v2.0/order/get_order_draft', {
      params,
    })
  },

  updateOrderDraft: (params: UpdateOrderDraft) => {
    return axiosClient.post('/api/v2.0/order/order_update', {
      params: params,
    })
  },

  createOrderDone: (
    params: CreateOrderDoneReq
  ): Promise<HTTPResponse<{ sale_order_id: CreateOrderDoneRes[] }>> => {
    return axiosClient.post('/api/v2.0/order/order_done', {
      params: params,
    })
  },

  getDeliveryMethods: (
    params: GetDeliveryMethodsReq
  ): Promise<HTTPResponse<DeliveryMethodRes[]>> => {
    return axiosClient.post('/delivery_carrier/get_available_carrier', {
      params: params,
    })
  },

  confirmDeliveryMethod: (
    params: ConfirmDeliveryMethodReq
  ): Promise<HTTPResponse<ConfirmDeliveryMethodRes>> => {
    return axiosClient.post('/delivery_carrier/confirm_delivery_carrier', {
      params,
    })
  },

  getStatusOrder: (): Promise<HTTPResultResponse<GetStatusOrderRes>> => {
    return axiosClient.post('/api/v2.0/order/get_status_order', {})
  },

  getOrderTags: (): Promise<HTTPResponse<(IdAndName & { color: string })[]>> => {
    return axiosClient.post('/api/v3.0/order/get_sale_tags', {
      params: {},
    })
  },

  getPaymentList: () => {
    return axiosClient.post('/vnpay_controller/get_payment_method_in_app', { params: {} })
  },

  createPayment: (params: CreatePaymentParams) => {
    return axiosClient.post('/vnpay_controller/create_payment', {
      params: params,
    })
  },

  confirmTransaction: (params: ConfirmTransactionParams) => {
    return axiosClient.post('/payment/vnpay/confirm_transaction', {
      params: params,
    })
  },

  getOrderHistoryList: (params: OrderFilterParams) => {
    return axiosClient.post('/api/v3.0/order/get_order_history', {
      params: params,
    })
  },

  getOrderHistoryDetail: (params: SaleOrderId): Promise<AxiosResponse<OrderHistoryDetail>> => {
    return axiosClient.post('/api/v2.0/information_booking/get_info_booking', {
      params: params,
    })
  },

  createOpportunity: (params: CreateOpportunityParams) => {
    return axiosClient.post('/medicine_order_controller/create_opportunity', {
      params: params,
    })
  },
}

export { orderAPI }
