import { PostDetail as IPostDetail } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { ShareSocial } from '../shareSocial'
import { DOMAIN_URL } from '@/constants'
import { generateProductSlug } from '@/helper'

interface PostDetailProps {
  data: IPostDetail
  className?: string
}

export const PostDetail = ({ data, className }: PostDetailProps) => {
  return (
    <div className={twMerge(classNames(`post-content bg-white p-12`, className))}>
      <div dangerouslySetInnerHTML={{ __html: data?.content + '' }}></div>

      <div className="mr-8 flex items-center my-32">
        <p className="text-text-color text-md font-semibold mr-12">Chia sẻ: </p>
        <ShareSocial
          title={data?.title}
          slug={`${DOMAIN_URL}/post-detail?slug=${generateProductSlug(data?.title, data?.id)}`}
        />
      </div>
    </div>
  )
}
