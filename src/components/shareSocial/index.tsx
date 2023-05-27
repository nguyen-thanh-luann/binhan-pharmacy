import { facebookIcon, linkedIcon, zaloIcon } from '@/assets'
import { DOMAIN_URL } from '@/constants'
import { generateProductSlug } from '@/helper'
import classNames from 'classnames'
import { FacebookShareButton, LinkedinShareButton } from 'react-share'
import { twMerge } from 'tailwind-merge'
import { Divider } from '../divider'
import { Image } from '../image'
// import ZaloSDK from 'zalo-sdk'

interface ShareSocialProps {
  className?: string
  product_id: number
  name: string
}

export const ShareSocial = ({ className, product_id, name }: ShareSocialProps) => {
  const slug = `${DOMAIN_URL}/${generateProductSlug(name, product_id)}`

  const handleShareZalo = () => {
    // Open Zalo Share dialog
    window.open(
      `https://zalo.me/share?url=${encodeURIComponent(slug)}`,
      'zaloshare',
      'width=600,height=600'
    )
  }

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

      <div onClick={handleShareZalo}>
        <Image
          src={zaloIcon}
          className="w-32 h-32 object-cover cursor-pointer"
        />
      </div>

      <Divider />

      <LinkedinShareButton className="button-share-linkedin" title={name} url={slug}>
        <Image src={linkedIcon} className="w-32 h-32 object-cover cursor-pointer" />
      </LinkedinShareButton>
    </div>
  )
}
