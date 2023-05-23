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
  imageClassName?: string
  imagePhotoClassName?: string
  titleClassName?: string
  shortContentClassName?: string
}

export const PostListItemHorizontal = ({
  data,
  className,
  imageClassName,
  imagePhotoClassName,
  titleClassName,
  shortContentClassName,
}: PostItemProps) => {
  const postSlug = `/post/${generateProductSlug(data?.title, data?.id)}`

  return (
    <div className={twMerge(classNames(`group rounded-[10px] bg-white`, className))}>
      <Link href={postSlug}>
        <div className="flex gap-12">
          <div className="w-fit">
            <Image
              src={data?.thumbnail?.thumbnail_url}
              imageClassName={classNames(
                'object-cover aspect-1 rounded-[10px] hover:scale-110 duration-200 ease-in-out h-[150px] w-[150px]',
                imageClassName
              )}
              className={classNames('overflow-hidden rounded-[10px] mb-12', imagePhotoClassName)}
            />
          </div>

          <div className="flex-1">
            <p
              className={classNames(
                'text-text-color font-bold text-md leading-9 line-clamp-2 group-hover:text-primary duration-200 ease-in-out',
                titleClassName
              )}
            >
              {data?.title}
            </p>

            <p
              className={classNames(
                'text-text-color text-base leading-9 line-clamp-2 group-hover:text-primary duration-200 ease-in-out',
                shortContentClassName
              )}
            >
              {data?.short_content}
            </p>

            <p className="text-gray text-sm">{moment(data?.created_at).format('DD/MM/YYYY')}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
