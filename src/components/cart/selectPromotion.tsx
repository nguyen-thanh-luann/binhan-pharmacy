import { LeftIcon } from '@/assets'
import { UseQueryListPropsV2, useQueryListV2, useSelectPromotion } from '@/hooks'
import { HTTPListResponse, PromotionRange, PromotionRes, QueryList } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import produce from 'immer'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Key } from 'swr'
import { Button } from '../button'
import { NotFound } from '../notFound'
import { Spinner } from '../spinner'
import { PromotionItem } from './promotionItem'
import { PromotionRanges } from './promotionRanges'

export type SelectPromotionProps<Params extends QueryList> = Pick<
  UseQueryListPropsV2<PromotionRes, Params>,
  'fetcher' | 'initialParams'
> & {
  swrKey: Key
  defaultValue?: PromotionRes[]
  onChange: (promtion: PromotionRes[]) => void
}

export const SelectPromotion = <Params extends QueryList>({
  fetcher,
  onChange,
  swrKey,
  defaultValue,
  initialParams,
}: SelectPromotionProps<Params>) => {
  const [promotionRangeLine, setPromotionRangeLine] = useState<PromotionRes | undefined>()
  const { toggleSelectedPromotion } = useSelectPromotion(swrKey)
  const { data, hasMore, isValidating, getMore } = useQueryListV2({
    fetcher,
    key: swrKey,
    initialParams,
    mutateFetcherResponse,
  })

  function mutateFetcherResponse(res: HTTPListResponse<PromotionRes[]>) {
    return produce(res, (draft) => {
      draft.result.forEach((item) => {
        const duplicatePromo = defaultValue?.find(
          (promo) => promo.promotion_id === item.promotion_id
        )
        if (duplicatePromo?.promotion_id) {
          item.selected_range_line = duplicatePromo.selected_range_line
          item.active = true
        }
      })
    })
  }

  const handleTogglePromotion = (data: PromotionRes) => {
    const ranges = data?.range_ids as PromotionRange[]
    if (ranges?.length > 1) {
      setPromotionRangeLine(data)
    } else {
      toggleSelectedPromotion(
        {
          ...data,
          range_line: ranges?.length === 1 ? ranges[0] : undefined,
        },
        onChange
      )
    }

    // if (!data?.active && (ranges?.length || 0) > 0) {
    //   if (ranges?.length === 1) {
    //     toggleSelectedPromotion(
    //       {
    //         ...data,
    //         range_line: ranges[0],
    //       },
    //       onChange
    //     )
    //   } else {
    //     setPromotionRangeLine(data)
    //   }
    // } else {
    //   toggleSelectedPromotion(data, onChange)
    // }
  }

  const handlePress = (promotion: PromotionRes) => {
    if (promotion.can_apply && (promotion?.range_ids as PromotionRange[])?.length) {
      setPromotionRangeLine(promotion)
    }
  }

  if (isValidating) {
    return (
      <div className="flex-1 flex-center">
        <Spinner />
      </div>
    )
  }

  if (!data?.length) return <NotFound notify="Không tìm thấy khuyến mãi nào" />

  return (
    <div className="flex-1 flex flex-col h-full rounded-[5px] overflow-x-hidden">
      <AnimatePresence>
        {promotionRangeLine ? (
          <motion.div
            className="h-full"
            initial={{ opacity: 0, x: 500 }}
            exit={{ opacity: 0, x: 500 }}
            animate={{
              opacity: promotionRangeLine ? 1 : 0,
              x: promotionRangeLine ? 0 : 500,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ display: promotionRangeLine ? 'block' : 'none' }}
          >
            <div className="h-full flex-1 flex-col flex">
              <div className="flex items-center justify-between px-16 py-12 bg-white border-y-border-1 border-y border-solid">
                <div className="w-32">
                  <Button
                    icon={<LeftIcon className="text-base" />}
                    onClick={() => setPromotionRangeLine(undefined)}
                  />
                </div>
                <p className="flex-1 line-clamp-1 text-lg">{promotionRangeLine.promotion_name}</p>
              </div>

              <PromotionRanges
                defaultValue={promotionRangeLine?.selected_range_line || undefined}
                onChange={(range_line) => {
                  toggleSelectedPromotion({ ...promotionRangeLine, range_line }, onChange)
                  setPromotionRangeLine(undefined)
                }}
                data={promotionRangeLine?.range_ids as PromotionRange[]}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          className="flex-1 overflow-y-auto"
          id="select-promotion-scrollable"
          initial={{ opacity: 1, x: 0 }}
          animate={{
            opacity: !promotionRangeLine ? 1 : 0,
            x: !promotionRangeLine ? 0 : -500,
          }}
          exit={{ opacity: 0, x: -500 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ display: !promotionRangeLine ? 'block' : 'none' }}
        >
          <InfiniteScroll
            scrollableTarget="select-promotion-scrollable"
            className="p-16"
            dataLength={data?.length || 0}
            next={getMore}
            hasMore={hasMore}
            loader={
              hasMore ? (
                <div className="my-12 flex-center">
                  <Spinner />
                </div>
              ) : null
            }
          >
            {data.map((item) => (
              <PromotionItem
                onPress={handlePress}
                className="mb-12 last:mb-0"
                active={item?.active}
                disabled={!item.can_apply}
                onToggle={handleTogglePromotion}
                key={item.promotion_id}
                data={item}
              />
            ))}
          </InfiniteScroll>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
