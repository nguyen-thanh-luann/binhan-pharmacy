import { POPUP_NOTIFICATION } from '@/constants'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '../button'
import { Modal } from '../modal'

interface PopUpProps {
  className?: string
}

export const IntroPopUp = ({ className }: PopUpProps) => {
  const [isOpen, setOpen] = useState<boolean>(() => !sessionStorage.getItem('is_open_popup'))

  const modalRef = useRef<HTMLDivElement>(null)

  // useClickOutside([modalRef], () => handleClose())

  const handleClose = () => {
    setOpen(false)
    sessionStorage.setItem('is_open_popup', 'true')
  }

  const hanldeDeny = () => {
    toast.error('Bạn phải đồng ý điều khoản để sử dụng dịch vụ của chúng tôi!')
  }

  return (
    <div className={classNames('', className)}>
      {isOpen ? (
        <Modal
          visible={isOpen}
          animationType="fade"
          headerClassName="hidden"
          modalClassName="p-20 w-[512px] max-w-[90%] h-fit max-h-[80vh] rounded-[10px]"
        >
          <div ref={modalRef} className="bg-white">
            <p className="text-md text-text-color mb-12">{POPUP_NOTIFICATION}</p>

            <div className="flex-center flex-wrap gap-12">
              <Button
                title="Tôi Đồng Ý"
                onClick={handleClose}
                className="bg-primary rounded-full border border-primary px-12 py-6 hover:bg-white group"
                textClassName="text-white text-md group-hover:text-primary"
              />

              <Button
                title="Tôi Không Đồng Ý"
                onClick={hanldeDeny}
                className="bg-orange rounded-full opacity-50 hover:opacity-100 px-12 py-6"
                textClassName="text-white text-md"
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
