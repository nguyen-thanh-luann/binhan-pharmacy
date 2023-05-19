import { empty } from '@/assets'
import React from 'react'
import { Image } from '../image'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

interface NotFoundProps {
  notify?: string
  image?: string
  imageClassName?: string
  notifyClassName?: string
  className?: string
}

export const NotFound = ({
  image,
  notify,
  className,
  imageClassName,
  notifyClassName,
}: NotFoundProps) => {
  return (
    <div className={twMerge(classNames('flex flex-col items-center justify-center', className))}>
      <Image
        src={image || empty}
        className={twMerge(classNames('w-[200px] h-[200px]', imageClassName))}
      />

      <p className={twMerge(classNames('title text-center', notifyClassName))}>{notify || ''}</p>
    </div>
  )
}
