import { SWR_KEY } from '@/constants'
import { usePostDetail } from '@/hooks'
import React from 'react'
import { PostDetailLoading } from './postDetailLoading'
import { isObjectHasValue } from '@/helper'
import { PostDetail } from './postDetail'
import { NotFound } from '../notFound'
import classNames from 'classnames'

interface PostOwnerDetailProps {
  post_id: string
  className?: string
}

export const PostOwnerDetail = ({ post_id, className }: PostOwnerDetailProps) => {
  const { data: postDetail, isValidating } = usePostDetail({
    key: `${SWR_KEY.get_post_detail}_${post_id}`,
    params: { post_id },
  })

  return (
    <div className={classNames('', className)}>
      {isValidating ? (
        <PostDetailLoading />
      ) : isObjectHasValue(postDetail) ? (
        <div>
          <PostDetail className="mb-32 bg-white" data={postDetail} />
        </div>
      ) : (
        <NotFound notify="Không tìm thấy thông tin bài viết" />
      )}
    </div>
  )
}
