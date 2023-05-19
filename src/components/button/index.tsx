import classNames from 'classnames'
import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Spinner } from '../spinner'

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean
  title?: string
  icon?: ReactNode
  variant?: 'primary' | 'secondary'
  btnType?: 'outline' | 'contained'
  textClassName?: string
}

export const Button = ({
  title,
  icon,
  style,
  loading = false,
  btnType = 'contained',
  className,
  textClassName,
  ...attributes
}: ButtonProps) => {
  return (
    <button
      disabled={attributes?.disabled || loading}
      onClick={(e) => !loading && !attributes.disabled && attributes?.onClick?.(e)}
      {...attributes}
      className={twMerge(
        classNames(
          'flex-center text_md rounded-md py-4 duration-150 ease-in-out',
          { 'pointer-events-none': attributes.disabled },
          className
        )
      )}
    >
      <>
        {loading ? (
          <Spinner className="w-[16px] h-[16px] mr-[8px]" />
        ) : icon ? (
          <span className={title ? 'mr-[8px]' : ''}>{icon}</span>
        ) : null}

        {title ? <p className={twMerge(classNames(''), textClassName)}>{title}</p> : null}
      </>
    </button>
  )
}
