import {
  ApplyPromotionReq,
  CancelPromotionReq,
  GetCategoryPromotionReq,
  GetGlobalPromotionReq,
  GetListPromotionCanApplyReq,
  GetProductPromotionMultipleRes,
  GetProductPromotionSingleRes,
  GetPromotionApplyOnCategoryMultipleRes,
  GetPromotionApplyOnCategoryReq,
  GetPromotionApplyOnCategorySingleRes,
  GetPromotionApplyOnCompanyMultipleRes,
  GetPromotionApplyOnCompanyReq,
  GetPromotionApplyOnCompanySingleRes,
  GetPromotionDetailReq,
  GetPromotionValueReq,
  GetPromotionsAppliedOnProductReq,
  GetPromotionsReq,
  HTTPResponseDataV2,
  HTTPResponseV2,
  PromotionDetailRes,
  PromotionItemRes,
  PromotionProductItemRes,
  PromotionRes,
} from '@/types'
import axiosClient from '.'

export const promotionAPI = {
  getPromotions: (params: GetPromotionsReq): Promise<HTTPResponseV2<PromotionItemRes[]>> => {
    return axiosClient.get(`/promotion_controller/get_list_promotion`, {
      params,
    })
  },
  getPromotionsCanApplyOnProducts: (
    params: GetPromotionsAppliedOnProductReq
  ): Promise<GetProductPromotionSingleRes | GetProductPromotionMultipleRes> => {
    return axiosClient.post(`/promotion_controller/promotion_apply_on_product`, {
      params,
    })
  },
  getGlobalPromotions: (params: GetGlobalPromotionReq): Promise<HTTPResponseV2<PromotionRes[]>> => {
    return axiosClient.get(`/list_promotion_controller/global`, {
      params,
    })
  },
  getCategoryPromotions: (
    params: GetCategoryPromotionReq
  ): Promise<HTTPResponseV2<PromotionRes[]>> => {
    return axiosClient.get(`/list_promotion_controller/category`, {
      params,
    })
  },
  getPromotionDetail: (
    params: GetPromotionDetailReq
  ): Promise<HTTPResponseDataV2<PromotionDetailRes>> => {
    return axiosClient.get(`/promotion_controller/detail_promotion`, {
      params,
    })
  },
  getPromotionsCanApplyOnSaleOrder: (
    params: GetListPromotionCanApplyReq
  ): Promise<HTTPResponseV2<PromotionRes[]>> => {
    return axiosClient.post(`/promotion_controller/promotion_can_apply_on_sale_order`, {
      params,
    })
  },
  getPromotionValue: (
    params: GetPromotionValueReq
  ): Promise<HTTPResponseDataV2<{ promotion_total: number }>> => {
    return axiosClient.post(`/promotion_controller/get_value_promotion`, {
      params,
    })
  },
  getPromotionsAppyOnCompany: (
    params: GetPromotionApplyOnCompanyReq
  ): Promise<GetPromotionApplyOnCompanySingleRes | GetPromotionApplyOnCompanyMultipleRes> => {
    return axiosClient.post(`/promotion_controller/promotion_apply_on_order`, {
      params,
    })
  },
  getPromotionsApplyOnCategory: (
    params: GetPromotionApplyOnCategoryReq
  ): Promise<GetPromotionApplyOnCategorySingleRes | GetPromotionApplyOnCategoryMultipleRes> => {
    return axiosClient.post(`/promotion_controller/promotion_apply_on_category_minor`, {
      params,
    })
  },
  applyPromotion: (params: ApplyPromotionReq): Promise<HTTPResponseV2<{}>> => {
    return axiosClient.post(`/promotion_controller/apply_promotion`, {
      params,
    })
  },
  cancelPromotion: (params: CancelPromotionReq): Promise<HTTPResponseV2<{}>> => {
    return axiosClient.post(`/promotion_controller/cancel_promotion`, {
      params,
    })
  },

  getProductPromotion: (product_id: number): Promise<HTTPResponseV2<PromotionProductItemRes[]>> => {
    return axiosClient.get('/list_promotion_controller/promotion_product', {
      params: { product_id },
    })
  },
}
