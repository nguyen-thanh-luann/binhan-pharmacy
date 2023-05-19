import classNames from 'classnames'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { NotFound } from '../notFound'
import { Star } from '../star'
import { StarIconOutline, StarIconSolid } from '@/assets'
import { StarString } from '@/types'
import { useStatisticalRating } from '@/hooks'
import { RatingCount } from './ratingCount'

interface RatingProps {
  className?: string
}

export const Rating = ({ className }: RatingProps) => {
  const [starCounts, setStarCounts] = useState<StarString[]>([])

  const {
    data: { detail_star_rating: ratingGroup = [], rating_total = 0, star_avg = 0 } = { data: [] },
  } = useStatisticalRating({ id: 0, shouldFetch: false })
  console.log({ ratingGroup, rating_total });
  

  const isActive = (count: StarString) => starCounts?.includes(count)

  const toggleStarCounts = (count: StarString) => {
    if (starCounts?.includes(count)) {
      const newStarCounts = [...starCounts].filter((item) => item !== count)
      setStarCounts(newStarCounts)
      // filterProductRatings({ product_tmpl_id: product_id, star_ratings: newStarCounts }, () => {
      //   setStarCounts(newStarCounts)
      //   if (offset) setOffset(0)
      // })
    } else {
      const newStarCounts = [...starCounts, count]
      // filterProductRatings({ product_tmpl_id: product_id, star_ratings: newStarCounts }, () => {
      //   setStarCounts(newStarCounts)
      //   if (offset) setOffset(0)
      // })
      setStarCounts(newStarCounts)
    }
  }

  return (
    <div className={twMerge(classNames(``, className))}>
      <div className="flex gap-12 md:gap-24 flex-col md:flex-row mb-12">
        <div>
          <div className="flex items-center mb-12">
            <p className="text-2xl text-orange mr-8">0</p>
            <div className="">
              <Star readonly size={18} ratingValue={star_avg * 20} className="mb-8" />
              <p className="text-sm text-text-color">0 nhận xét</p>
            </div>
          </div>

          <div>
            {/* {ratingGroup?.length > 0 &&
              ratingGroup?.map((rating, index) => (
                <RatingCount
                  key={index}
                  star={Number(rating.star_rating) || 0}
                  starQuantity={Number(rating.rating_count) || 0}
                  totalQuantity={rating_total}
                />
              ))} */}
            {[5,4,3,2,1].map((rating, index) => (
                <RatingCount
                  key={index}
                  star={Number(rating) || 0}
                  starQuantity={Number(index * 2) || 0}
                  totalQuantity={index * 10}
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

      <NotFound notify="Không tìm thấy đánh giá nào cho sản phẩm" />
    </div>
  )
}
