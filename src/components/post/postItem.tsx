import { Post } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import { Image } from '../image'
import { generateProductSlug } from '@/helper'
import moment from 'moment'

interface PostItemProps {
  data: Post
  className?: string
}

export const PostItem = ({ data, className }: PostItemProps) => {

  const postSlug = `/post${generateProductSlug(data?.title, data?.id)}`

  return (
    <div
      className={twMerge(
        classNames(
          `group rounded-[10px] h-[300px] overflow-hidden`,
          className
        )
      )}
    >
      <Link href={postSlug}>
        <div>
          <Image
            src={data?.thumbnail?.thumbnail_url}
            imageClassName="object-cover aspect-1 rounded-tl-[10px] rounded-tr-[10px] hover:scale-110 duration-200 ease-in-out"
            className="mb-16 h-[210px] overflow-hidden"
          />

          <div className="p-12">
            <p className='text-gray text-sm'>{moment(data?.created_at).format('DD/MM/YYYY')}</p>
            <p className="text-text-color font-bold text-md leading-9 line-clamp-2 group-hover:text-primary duration-200 ease-in-out">
              {data?.title}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
