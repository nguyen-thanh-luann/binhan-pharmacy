import { useRouter } from 'next/router'
import classNames from 'classnames'
import React from 'react'
import { useAuth, useModal, useUser } from '@/hooks'
import { accountIconStyle, accountNavData } from '@/data'
import { LogoutIconOutline, RightIcon } from '@/assets'
import { ModalConfirm } from '../modal'

interface AccountNavMobileProps {
  className?: string
}

export const AccountNavMobile = ({ className }: AccountNavMobileProps) => {
  const router = useRouter()
  const { logout } = useAuth()
  const { userInfo } = useUser({})
  const { closeModal, openModal, visible: showModalConfirm } = useModal()

  const hanldeLogout = () => {
    logout(() => {
      router.reload()
      closeModal()
    })
  }

  return (
    <div className={classNames('p-12 bg-white', className)}>
      {accountNavData?.map((item, index) => {
        const isActive = item.path === router.pathname

        return (
          <div
            onClick={() => {
              router.push(item.path)
            }}
            key={index}
            className={classNames(
              `flex-between p-10 rounded-[10px] cursor-pointer group hover:text-primary mb-12 last:mb-0 isActive:opacity-50`,
              isActive ? 'text-primary' : '',
              item?.access_rules?.includes(userInfo?.account?.account_type || '') ? '' : 'hidden'
            )}
          >
            <div className="flex items-center">
              <div
                className={classNames(
                  'w-24 h-24 text-text-color flex-center text-lg group-hover:text-primary',
                  isActive ? '!text-primary' : ''
                )}
              >
                {item?.icon}
              </div>
              <p
                className={classNames(
                  'ml-4 h-24 text-md group-hover:text-primary',
                  isActive ? '!text-primary' : ''
                )}
              >
                {item?.title}
              </p>
            </div>

            <RightIcon className={classNames('', isActive ? '!text-primary' : '')} />
          </div>
        )
      })}

      <div
        onClick={openModal}
        className={`flex p-10 cursor-pointer rounded-[10px] border border-white hover:border-red group`}
      >
        <div className="w-24 h-24 text-text-color flex-center text-lg group-hover:text-red">
          <LogoutIconOutline className={accountIconStyle} />
        </div>
        <p className="ml-4 text-md text-text-color group-hover:text-red">Đăng xuất</p>
      </div>

      <ModalConfirm
        visible={showModalConfirm}
        title="Bạn có chắc muốn đăng xuất?"
        onConfirm={hanldeLogout}
        onDeny={closeModal}
      />
    </div>
  )
}
