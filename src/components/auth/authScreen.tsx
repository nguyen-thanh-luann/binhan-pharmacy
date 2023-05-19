import { LeftIcon, TimesIcon } from '@/assets'
import { setAuthOption } from '@/store'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import React, { ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { twMerge } from 'tailwind-merge'

interface AuthScreenProps {
  onClose?: () => void
  onBack?: () => void
  showCloseButton?: boolean
  children: ReactNode
  headerClassName?: string
  titleGroupClassName?: string
  title?: string
  subTitle?: string
  titleClassName?: string
  subTitleClassName?: string
  footerOption?: 'login' | 'signup'
}

export const AuthScreen = ({
  children,
  headerClassName,
  onClose,
  onBack,
  title,
  titleGroupClassName,
  subTitle,
  titleClassName,
  subTitleClassName,
  footerOption,
  showCloseButton = true
}: AuthScreenProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  
  return (
    <div className="">
      {/* header */}
      <div
        className={twMerge(classNames('flex justify-between items-center p-16', headerClassName))}
      >
        <div>
          {onBack ? (
            <button onClick={() => onBack?.()} className="w-24 h-2 flex-center">
              <LeftIcon className="text-gray text-base" />
            </button>
          ) : null}
        </div>

        {showCloseButton && (
          <button className="w-24 h-24 flex-center" onClick={() => onClose?.()}>
            <TimesIcon className="text-gray text-base" />
          </button>
        )}
      </div>

      <div className={twMerge(classNames('mb-24 px-24', titleGroupClassName))}>
        <p className={twMerge(classNames('title_xl mb-12', titleClassName))}>{title}</p>
        <p className={twMerge(classNames('title_md', subTitleClassName))}>{subTitle}</p>
      </div>

      {/* Main content */}

      {children}

      {/* footer */}
      <div>
        {footerOption === 'login' ? (
          <div className="flex flex-center">
            <p className="title">
              Bạn đã có tài khoản?{' '}
              <span
                onClick={() => {
                  dispatch(setAuthOption('loginPassword'))
                }}
                className="!text-primary cursor-pointer"
              >
                Đăng nhập
              </span>
            </p>
          </div>
        ) : footerOption === 'signup' ? (
          <div className="flex flex-center">
            <p className="title">
              Bạn chưa có tài khoản?{' '}
              <span
                onClick={() => {
                  router.push('/register')
                  dispatch(setAuthOption(undefined))
                }}
                className="!text-primary cursor-pointer"
              >
                Đăng ký
              </span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
