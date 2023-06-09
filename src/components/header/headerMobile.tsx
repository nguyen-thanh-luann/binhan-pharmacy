import { MenuIcon, logoLg } from '@/assets'
import { useClickOutside, useModal } from '@/hooks'
import classNames from 'classnames'
import Link from 'next/link'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { CartDrawer } from '../cart'
import { HeaderSearchProduct } from '../headerSearchProduct'
import { Image } from '../image'
import { LeftNavigation } from '../leftNavigation'
import { Modal } from '../modal'

interface HeaderMobileProps {
  className?: string
}

export const HeaderMobile = ({ className }: HeaderMobileProps) => {
  const { visible, closeModal, toggle } = useModal()
  const leftNavigationRef = useRef<HTMLDivElement>(null)

  useClickOutside([leftNavigationRef], () => closeModal())

  return (
    <div className={twMerge(classNames('relative', className))}>
      <div
        className={`bg-background h-header_mobile_height md:hidden flex items-center fixed top-0 left-0 right-0 z-50`}
      >
        <div className="container px-12">
          <div className="flex-between mb-12">
            <div onClick={() => toggle()} className="cursor-pointer">
              <MenuIcon className="w-[42px] h-[42px] text-gray" />
            </div>

            <div className="flex-1 flex-center">
              <Link href="/">
                <Image src={logoLg} className="w-[130px] h-[40px]" />
              </Link>
            </div>

            <div className="flex items-center justify-between gap-12">
              <CartDrawer />
            </div>
          </div>

          <div className="">
            <HeaderSearchProduct />
          </div>
        </div>
      </div>

      <Modal
        visible={visible}
        animationType="slideFromRight"
        headerClassName="hidden"
        modalClassName="h-full w-full max-w-[350px] fixed left-0"
      >
        <div ref={leftNavigationRef} className="h-full">
          <LeftNavigation onClose={closeModal} />
        </div>
      </Modal>
    </div>
  )
}
