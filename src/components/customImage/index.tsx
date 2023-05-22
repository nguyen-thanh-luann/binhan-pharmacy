import React from 'react'
import RImage, { ImageProps as RImageProps } from 'next/image'
import { empty, imageBlur } from '@/assets'
import classNames from 'classnames'
import { isRemoteImageUrl } from '@/helper'
import { API_URL } from '@/constants'

export type CustomImageProps = Omit<RImageProps, 'alt'> & {
  alt?: string
  className?: string
  imageClassName?: string
}

export const CustomImage = ({ className, imageClassName, src, ...props }: CustomImageProps) => {
  return (
    <div className={classNames('relative', className)}>
      <RImage
        src={src && src !== '' ? (isRemoteImageUrl(src.toString()) ? src : `${API_URL}${src}`) : empty}
        width={1000}
        height={1000}
        className={classNames(imageClassName)}
        alt=""
        loading="lazy"
        blurDataURL={imageBlur}
        {...props}
      />
    </div>
  )
}
