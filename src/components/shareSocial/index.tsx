import React from 'react'
import { Image } from '../image'
import { toast } from 'react-hot-toast'
import { facebookIcon, linkedIcon, zaloIcon } from '@/assets'
import { Divider } from '../divider'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'

interface ShareSocialProps {
  className?: string
}

export const ShareSocial = ({ className }: ShareSocialProps) => {
  return (
    <div className={twMerge(classNames(`flex items-center`, className))}>

      <Image
        onClick={() => {
          toast.success('comming soon')
        }}
        src={facebookIcon}
        className="w-32 h-32 object-cover cursor-pointer"
      />

      <Divider />

      <Image
        src={zaloIcon}
        onClick={() => {
          toast.success('comming soon')
        }}
        className="w-32 h-32 object-cover cursor-pointer"
      />

      <Divider />

      <Image
        src={linkedIcon}
        onClick={() => {
          toast.success('comming soon')
        }}
        className="w-32 h-32 object-cover cursor-pointer"
      />
    </div>
  )
}
