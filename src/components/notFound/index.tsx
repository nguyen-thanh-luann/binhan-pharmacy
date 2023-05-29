import { companyIconSm } from '@/assets'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { Image } from '../image'

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
        src={image || companyIconSm}
        className={twMerge(classNames('w-[200px] h-[200px] mb-12', imageClassName))}
      />

      <p className={twMerge(classNames('title text-center', notifyClassName))}>{notify || ''}</p>
    </div>
  )
}
