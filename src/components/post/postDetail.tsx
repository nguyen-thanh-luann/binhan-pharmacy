import { PostDetail as IPostDetail } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface PostDetailProps {
  data: IPostDetail
  className?: string
}

export const PostDetail = ({data, className}: PostDetailProps) => {
  return (
    <div className={twMerge(classNames(`bg-white p-12`, className))}>
        <div dangerouslySetInnerHTML={{__html: data?.content + ''}}></div>
    </div>
  )
}
