import { StarIconOutline, StarIconSolid } from '@/assets'
import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useRating, useStatisticalRating } from '@/hooks'
import { StarString } from '@/types'
import classNames from 'classnames'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { twMerge } from 'tailwind-merge'
import { NotFound } from '../notFound'
import { Star } from '../star'
import { RatingCount } from './ratingCount'
import { RatingItem } from './ratingItem'
import { RatingItemLoading } from './ratingItemLoading'

interface RatingProps {
  className?: string
  product_id: number
}

export const Rating = ({ className, product_id }: RatingProps) => {
  const [starCounts, setStarCounts] = useState<StarString[]>(['5'])

  const { ratings, getMore, hasMore, isValidating, filter } = useRating({
    key: `${SWR_KEY.get_product_rating}_${product_id}`,
    params: {
      product_id,
      comment_type: ['rating'],
    },
  })

  const {
    data: { detail_star_rating: ratingGroup = [], rating_total = 0, star_avg = 0 } = { data: [] },
  } = useStatisticalRating({ id: product_id })

  const isActive = (count: StarString) => starCounts?.includes(count)

  const toggleStarCounts = (count: StarString) => {
    if (starCounts?.includes(count)) {
      const newStarCounts = [...starCounts].filter((item) => item !== count)

      setStarCounts(newStarCounts)
      filter({
        comment_type: ['rating'],
        product_id: product_id,
        star_rating: newStarCounts,
        limit: DEFAULT_LIMIT,
      })
    } else {
      const newStarCounts = [...starCounts, count]
      filter({
        comment_type: ['rating'],
        product_id: product_id,
        star_rating: newStarCounts,
        limit: DEFAULT_LIMIT,
      })
      setStarCounts(newStarCounts)
    }
  }

  const rendeRatingLoader = (number?: number, className?: string) => {
    return (
      <div className={classNames('', className)}>
        {Array.from({ length: number || 7 }).map((_, index) => (
          <RatingItemLoading key={index} className="mb-12 last:mb-0" />
        ))}
      </div>
    )
  }

  return (
    <div className={twMerge(classNames(``, className))}>
      <div className="flex gap-12 md:gap-24 flex-col md:flex-row mb-12">
        <div>
          <div className="flex items-center mb-12">
            <p className="text-2xl text-orange mr-8">{star_avg}</p>
            <div className="">
              <Star readonly size={18} ratingValue={star_avg * 20} className="mb-8" />
              <p className="text-sm text-text-color">{`${rating_total} đánh giá`}</p>
            </div>
          </div>

          <div>
            {ratingGroup?.length > 0 &&
              ratingGroup?.map((rating, index) => (
                <RatingCount
                  key={index}
                  star={Number(rating.star_rating) || 0}
                  starQuantity={Number(rating.rating_count) || 0}
                  totalQuantity={rating_total}
                />
              ))}
          </div>
        </div>

        <div className="">
          <ul className="flex items-center gap-24 overflow-scroll scrollbar-hide">
            {[5, 4, 3, 2, 1].map((number) => (
              <li
                onClick={() => toggleStarCounts((number + '') as StarString)}
                key={number}
                className={`flex items-center gap-8 text-md leading-8 
                border border-gray-200 rounded-full min-w-[60px] p-4 px-12 
                cursor-pointer group hover:border-orange hover:text-orange duration-200
                ${isActive((number + '') as StarString) ? 'text-orange border-orange' : ''}`}
              >
                {number}
                {isActive((number + '') as StarString) ? <StarIconSolid /> : <StarIconOutline />}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-h-[50vh] overflow-scroll scrollbar-hide">
        <InfiniteScroll
          dataLength={ratings?.length || 0}
          next={() => getMore()}
          hasMore={hasMore}
          loader={hasMore ? rendeRatingLoader() : null}
        >
          <div>
            {isValidating ? (
              rendeRatingLoader()
            ) : isArrayHasValue(ratings) ? (
              <div>
                {ratings?.map((rating) => (
                  <RatingItem data={rating} className="mb-12 last:mb-0" />
                ))}
              </div>
            ) : (
              <NotFound notify="Không tìm thấy đánh giá nào cho sản phẩm" />
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  )
}
