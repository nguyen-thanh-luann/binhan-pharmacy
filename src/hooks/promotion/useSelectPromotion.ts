import produce from 'immer'
import useSWR, { Key } from 'swr'
import { HTTPListResponse, PromotionRange, PromotionRes } from '@/types'

export type ToggleSelectedPromotion = Omit<PromotionRes, 'range_line_ids'> & {
  range_line?: PromotionRange
}

export const useSelectPromotion = (swrKey: Key) => {
  const { data, isValidating, mutate } = useSWR<HTTPListResponse<PromotionRes[]>>(swrKey)

  const toggleSelectedPromotion = (
    params: ToggleSelectedPromotion,
    callback: (promotions: PromotionRes[]) => void
  ) => {
    if (!data?.result?.length) return

    const promotions = produce(data, (draft) => {
      const promotions = draft.result as PromotionRes[]
      const index = promotions.findIndex((item) => item.promotion_id === params.promotion_id)
      if (index === -1) return

      const promotion = promotions[index] as PromotionRes
      const isActive = !!promotion?.active

      if (isActive) {
        if (
          params.promotion_type === 'range' &&
          params?.range_line?.range_id &&
          params.range_line.range_id !== promotion.selected_range_line?.range_id
        ) {
          promotion.selected_range_line = params.range_line
        } else {
          promotion.active = false
          promotion.selected_range_line = null
        }
      } else {
        const duplicateIndex = promotions.findIndex(
          (item) => item?.active === true && item.promotion_level === promotion?.promotion_level
        )
        if (duplicateIndex !== -1) {
          const duplicatePromotionLevel = promotions[duplicateIndex] as PromotionRes
          duplicatePromotionLevel.active = false
          duplicatePromotionLevel.selected_range_line = null
        }

        if (promotion.promotion_level === 'primary_promotion') {
          const index = promotions.findIndex(
            (item) => item.active && item.promotion_level === 'special_promotion'
          )
          if (index !== -1) {
            const promotion = promotions[index]
            if (promotion) {
              promotion.active = false
              promotion.selected_range_line = null
            }
          }
        } else if (promotion.promotion_level === 'special_promotion') {
          const index = promotions.findIndex(
            (item) => item.active && item.promotion_level === 'primary_promotion'
          )
          if (index !== -1) {
            const promotion = promotions[index]
            if (promotion) {
              promotion.active = false
              promotion.selected_range_line = null
            }
          }
        }

        promotion.active = true
        if (params?.range_line?.range_id) {
          promotion.selected_range_line = params.range_line
        }
      }
    })

    mutate(promotions, false)
    callback([...promotions.result].filter((item) => item?.active))
  }

  return {
    data,
    isValidating,
    toggleSelectedPromotion,
  }
}
