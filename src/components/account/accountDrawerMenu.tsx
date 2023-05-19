import { AccountMenuData } from '@/data'
import { useAuth, useModal } from '@/hooks'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { ModalConfirm } from '../modal'

interface AccountMenuProps {
  className?: string
}

export const AccountDrawerMenu = ({ className }: AccountMenuProps) => {
  const router = useRouter()
  const { logout } = useAuth()
  const { closeModal, openModal, visible: showModalConfirm } = useModal()

  const handleMenuOptionClick = (path: string) => {
    if (path === 'logout') {
      openModal()
    } else {
      router.push(path)
    }
  }

  const hanldeLogout = () => {
    logout(() => {
      closeModal()
      router.reload()
    })
  }

  return (
    <>
      <div
        className={twMerge(
          classNames('bg-white shadow-shadow-1 rounded-[10px] p-12 w-[198px]', className)
        )}
      >
        {AccountMenuData.map((item, index) => (
          <div
            key={index}
            className="group/child flex items-center mb-12 last:mb-0 rounded-[6px] p-6 hover:bg-primary-100 cursor-pointer"
            onClick={() => handleMenuOptionClick(item.path)}
          >
            <div className="w-20 h-20 mr-6 !text-gray group-hover/child:!text-primary">
              {item?.icon}
            </div>

            <p className="title !text-gray group-hover/child:!text-primary">{item?.title}</p>
          </div>
        ))}
      </div>

      <ModalConfirm
        visible={showModalConfirm}
        title="Bạn có chắc muốn đăng xuất?"
        onConfirm={hanldeLogout}
        onDeny={closeModal}
      />
    </>
  )
}
