import { LogoutIconOutline } from '@/assets'
import { accountIconStyle, accountNavData } from '@/data'
import { useAuth, useModal, useUser } from '@/hooks'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { ModalConfirm } from '../modal'

interface AccountNavProps {
  className?: string
}
export const AccountNav = ({ className }: AccountNavProps) => {
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
    <div className={twMerge(classNames(`p-12 bg-white`, className))}>
      {accountNavData?.map((item, index) => {
        const isActive = item.path === router.pathname

        return (
          <div
            onClick={() => {
              router.push(item.path)
            }}
            key={index}
            className={classNames(
              `flex items-center p-10 rounded-[10px] cursor-pointer group hover:bg-primary mb-12 last:mb-0 isActive:opacity-50`,
              isActive ? 'bg-primary' : '',
              item?.access_rules?.includes(userInfo?.account?.account_type || '') &&
                item?.account_type_permissions?.includes(
                  userInfo?.account?.medicine_account_type || ''
                )
                ? ''
                : 'hidden'
            )}
          >
            <div
              className={classNames(
                'w-24 h-24 text-text-color flex-center text-lg group-hover:bg-primary group-hover:text-white',
                isActive ? '!text-white' : ''
              )}
            >
              {item?.icon}
            </div>
            <p
              className={classNames(
                'ml-4 h-24 text-md group-hover:bg-primary group-hover:text-white',
                isActive ? '!text-white' : ''
              )}
            >
              {item?.title}
            </p>
          </div>
        )
      })}

      <div
        onClick={openModal}
        className={`flex items-center p-10 cursor-pointer rounded-[10px] border border-white hover:border-red group`}
      >
        <div className="w-20 h-20 text-text-color flex-center text-lg group-hover:text-red">
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
