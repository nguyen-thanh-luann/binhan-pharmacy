import { facebookIcon, linkedIcon, zaloIcon } from '@/assets'
import classNames from 'classnames'
import { FacebookShareButton, LinkedinShareButton } from 'react-share'
import { twMerge } from 'tailwind-merge'
import { Divider } from '../divider'
import { Image } from '../image'
import { ZALO_OA_ID } from '@/constants'

interface ShareSocialProps {
  className?: string
  title: string
  slug: string
}

export const ShareSocial = ({ className, slug, title }: ShareSocialProps) => {
  const handleShareZalo = () => {
    const encodedUrl = encodeURIComponent(`${slug}`)
    const zaloShareUrl = `https://zalo.me/oa/${ZALO_OA_ID}/?utm_source=zalo&utm_medium=button&utm_campaign=website&url=${encodedUrl}`

    window.open(`${zaloShareUrl}`, 'zaloShare', 'width=600,height=600')
  }

  return (
    <div className={twMerge(classNames(`flex items-center`, className))}>
      <FacebookShareButton
        className="button-share-facebook"
        quote={title}
        title={title}
        hashtag={`#${title}`}
        url={slug}
      >
        <Image
          src={facebookIcon}
          className="w-32 h-32 object-cover cursor-pointer"
          imageClassName="w-32 h-32"
        />
      </FacebookShareButton>

      <Divider />

      <div onClick={handleShareZalo}>
        <Image
          src={zaloIcon}
          className="w-32 h-32 object-cover cursor-pointer"
          imageClassName="w-32 h-32"
        />
      </div>

      <Divider />

      <LinkedinShareButton className="button-share-linkedin" title={title} url={slug}>
        <Image
          src={linkedIcon}
          className="w-32 h-32 object-cover cursor-pointer"
          imageClassName="w-32 h-32"
        />
      </LinkedinShareButton>
    </div>
  )
}
