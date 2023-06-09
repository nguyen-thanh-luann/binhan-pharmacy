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

      <div className="border rounded-lg border-primary bg-white my-32 p-32">
        <div className="flex-center mb-12">
          <p className="text-primary text-md font-semibold mr-12">Chia sẻ cùng bạn bè: </p>
          <ShareSocial
            title={data?.title}
            slug={`${DOMAIN_URL}/post-detail?slug=${generateProductSlug(data?.title, data?.id)}`}
          />
        </div>

        <p className='text-base italic'>
          <strong>Lưu ý: </strong> Thông tin trong bài viết chỉ mang tính chất tham khảo, vui lòng liên hệ với Bác sĩ,
          Dược sĩ hoặc chuyên viên y tế để được tư vấn cụ thể.
        </p>
      </div>
    </div>
  )
}
