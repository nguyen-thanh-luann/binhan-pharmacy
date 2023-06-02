import { ReactElement } from 'react'
import { Modal, ModalTransitionType } from './modal'
import classNames from 'classnames'

interface modalSelectDataProps {
  visible: boolean
  animationType?: ModalTransitionType
  children: ReactElement
  modalClassName?: string
}

export const ModalSelectData = ({
  visible,
  animationType = 'fade',
  children,
  modalClassName,
}: modalSelectDataProps) => {
  return (
    <div>
      <Modal
        visible={visible}
        animationType={animationType}
        headerClassName="hidden"
        modalClassName={classNames(
          'h-fit max-h-[600px] w-[500px] max-w-[90%] rounded-[10px] overflow-scroll scrollbar-hide',
          modalClassName
        )}
      >
        {children}
      </Modal>
    </div>
  )
}
