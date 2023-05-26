import React from 'react'
import { Image } from '../image'
import { toast } from 'react-hot-toast'
import { facebookIcon, linkedIcon, zaloIcon } from '@/assets'
import { Divider } from '../divider'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'
import { FacebookShareButton, LinkedinShareButton } from 'react-share'
import { generateProductSlug } from '@/helper'
import { DOMAIN_URL } from '@/constants'

interface ShareSocialProps {
  className?: string
  product_id: number
  name: string
}

export const ShareSocial = ({ className, product_id, name }: ShareSocialProps) => {
  const slug = `${DOMAIN_URL}/${generateProductSlug(name, product_id)}`
  return (
    <div className={twMerge(classNames(`flex items-center`, className))}>
      <FacebookShareButton
        className="button-share-facebook"
        quote={name}
        title={name}
        hashtag={`#${name}`}
        url={slug}
      >
        <Image src={facebookIcon} className="w-32 h-32 object-cover cursor-pointer" />
      </FacebookShareButton>

      <Divider />

      <Image
        src={zaloIcon}
        onClick={() => {
          toast.success('comming soon')
        }}
        className="w-32 h-32 object-cover cursor-pointer"
      />

      <Divider />

      <LinkedinShareButton className="button-share-linkedin" title={name} url={slug}>
        <Image src={linkedIcon} className="w-32 h-32 object-cover cursor-pointer" />
      </LinkedinShareButton>
    </div>
  )
}
