import { Rating } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { CustomImage } from '../customImage'
import { Star } from '../star'

interface RatingItemProps {
  data: Rating
  className?: string
}

export const RatingItem = ({ data, className }: RatingItemProps) => {
  return (
    <div className={twMerge(classNames('flex gap-12', className))}>
      <div className="">
        <CustomImage
          src={data?.author?.avatar_url?.url}
          imageClassName="object-cover aspect-1 w-[32px] h-[32px] rounded-full"
        />
      </div>

      <div className="flex-1">
        <p className="text-base font-bold mb-8">{data?.author?.partner_name}</p>

        <Star
          readonly
          ratingValue={(data?.star_rating_int || 0) * 20}
          size={12}
          className="mb-12"
        />

        <div className="mb-12" dangerouslySetInnerHTML={{ __html: data.content }}></div>

        <div className="flex flex-wrap gap-12">
          {data?.image_urls?.map((img) => (
            <CustomImage
              key={img.id}
              src={img.url}
              className="overflow-hidden rounded-md"
              imageClassName="object-cover aspect-1 w-[180px] h-[110px] rounded-md hover:scale-110 duration-200 ease-in-out cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
