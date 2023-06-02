import { loginFormBanner } from '@/assets'
import { ReactNode } from 'react'
import { Image } from '../image'
import { Modal, ModalTransitionType } from './modal'

interface modalAuthProps {
  visible: boolean
  animationType?: ModalTransitionType
  children: ReactNode
}

export const ModalAuth = ({ visible, animationType = 'fade', children }: modalAuthProps) => {
  return (
    <div>
      <Modal
        visible={visible}
        animationType={animationType}
        headerClassName="hidden"
        modalClassName="w-modal_auth_width h-modal_auth_height max-w-full rounded-[16px] relative "
      >
        <div className="">
          <div className="absolute left-0 top-0 bottom-0 hidden md:flex">
            <Image
            alt=''
              src={loginFormBanner}
              className=""
              imageClassName="object-cover w-[320px] h-modal_auth_height rounded-tl-[16px] rounded-bl-[16px]"
            />
          </div>

          <div className="md:ml-[310px]">{children}</div>
        </div>
      </Modal>
    </div>
  )
}
