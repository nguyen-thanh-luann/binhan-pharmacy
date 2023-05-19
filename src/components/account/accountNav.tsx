import { LogoutIconOutline } from '@/assets'
import { accountIconStyle, accountNavData } from '@/data'
import { useAuth, useModal } from '@/hooks'
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
  const { closeModal, openModal, visible: showModalConfirm } = useModal()


  const hanldeLogout = () => {
    logout(() => {
      router.reload()
      closeModal()
    })
  }

  return (
    <div className={twMerge(classNames(`p-12 bg-white`, className))}>
      {accountNavData?.map((item, index) => (
        <div
          onClick={() => {
            router.push(item.path)
          }}
          key={index}
          className={`flex p-10 rounded-[10px] cursor-pointer group hover:bg-primary mb-12 last:mb-0 active:opacity-50 ${
            router.pathname === item.path ? 'bg-primary' : ''
          }`}
        >
          <div
            className={`w-24 h-24 text-text-color flex-center text-lg group-hover:bg-primary group-hover:text-white ${
              router.pathname === item.path ? '!text-white' : ''
            }`}
          >
            {item?.icon}
          </div>
          <p
            className={`ml-4 text-md group-hover:bg-primary group-hover:text-white ${
              router.pathname === item.path ? '!text-white' : ''
            }`}
          >
            {item?.title}
          </p>
        </div>
      ))}

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
