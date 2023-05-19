import { searchEmpty } from '@/assets'
import classnames from 'classnames'
import React from 'react'
import { Button } from '../button'
import { Image, ImageProps } from '../image'

export type FilterEmptyProps = Partial<ImageProps> & {
  title?: string
  children?: JSX.Element
  containerClassName?: string
  textClassName?: string
  btnTitle?: string
  onClick?: () => void
}

export const FilterEmpty = ({
  title = 'Không có dữ liệu',
  children,
  containerClassName,
  btnTitle,
  onClick,
  ...props
}: FilterEmptyProps) => {
  return (
    <div className={classnames('flex-center flex-col py-24', containerClassName)}>
      <Image className="w-[150px] h-[150px]" src={searchEmpty} {...props} alt="" />

      <p className="mb-3">{title}</p>

      {onClick ? (
        <Button style={{ marginTop: 24 }} onClick={() => onClick?.()} title={btnTitle} />
      ) : null}
      {children}
    </div>
  )
}
